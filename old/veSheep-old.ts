import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { Transfer, VeSheep } from "../src/types/VeSheep/VeSheep"
import { User } from "../src/types/schema"
import { REGISTRY_NAME, VE_SHEEP_ADDRESS, ADDRESS_ZERO } from './helpers';
import { Registry, Snapshot } from './types/schema';

export function handleTransfer(event: Transfer): void {
  // Registry
  let registry = Registry.load(REGISTRY_NAME);
  if (!registry) {
    registry = new Registry(REGISTRY_NAME);
    registry.users = [];
    registry.save();
    // handleNewBlock(event.block); // Set the first Snapshot
  }
  const to = event.params.to;
  const from = event.params.from;
  const amount = event.params.value;

  // v2 - No Computation

  let user = User.load(to.toHexString());
  if (!user) {
    user = new User(to.toHexString())
    user.balance = BigInt.fromI32(0); // Don't care
    user.registry = registry.id;
  }
  user.updated = event.block.timestamp;
  user.save()



  // v1 - Auto Computation

  // if (to === Address.fromString(ADDRESS_ZERO)) {
  //   // Burn
  //   let userFrom = User.load(from.toHex());
  //   if (!userFrom) return; // Error
  //   userFrom.balance = userFrom.balance.minus(amount);
  //   userFrom.updated = event.block.timestamp;
  //   userFrom.save()
  // } else {
  //   // Mint or UsuaL Transfer
  //   let userTo = User.load(to.toHex());
  //   if (!userTo) {
  //     userTo = new User(to.toHex())
  //     userTo.balance = amount;
  //     userTo.registry = registry.id;
  //   } else {
  //     userTo.balance = userTo.balance.plus(amount);
  //   }
  //   userTo.updated = event.block.timestamp;
  //   userTo.save()
  //   if (from !== Address.fromString(ADDRESS_ZERO)) {
  //     // Not a Mint so we remove 'amount' from the sender
  //     let userFrom = User.load(from.toHex());
  //     if (!userFrom) return; // Error
  //     userFrom = new User(event.transaction.from.toHex())
  //     userFrom.balance = userFrom.balance.minus(amount);
  //     userFrom.updated = event.block.timestamp;
  //     userFrom.save()
  //   }
  // }
}

export function handleNewBlock(block: ethereum.Block): void {
  const blockNumber = block.number;
  const twoWeeks = 300; // 3600 * 24 * 14
  if (blockNumber.toI32() % twoWeeks != 0) return;
  let registry = Registry.load(REGISTRY_NAME);
  if (!registry) {
    registry = new Registry(REGISTRY_NAME);
    registry.users = [];
    registry.save();
  }
  const veSheep = VeSheep.bind(Address.fromString(VE_SHEEP_ADDRESS));
  // New Snapshot
  let snapshot = new Snapshot("snapshot-" + block.number.toHexString())
  snapshot.registry = registry.id;
  snapshot.timestamp = block.timestamp;
  for (let x = 0; x < registry.users.length; x++) {
    const user = Address.fromString(registry.users[x]);
    snapshot.stakerAddresses.push(user);
    const b = veSheep.balanceOf(user);
    snapshot.stakerBalances.push(b);
  }
  snapshot.save();
  registry.save();
}
