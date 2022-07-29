import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"
import { Transfer, VeSheep } from "../src/types/VeSheep/VeSheep"
import { User } from "../src/types/schema"
import { REGISTRY_NAME, VE_SHEEP_ADDRESS, ADDRESS_ZERO } from './helpers';
import { Registry, Snapshot } from './types/schema';

export function handleTransfer(event: Transfer): void {
  let registry = Registry.load(REGISTRY_NAME);
  if (!registry) {
    log.info("handleTransfer: !registry", [])
    registry = new Registry(REGISTRY_NAME);
    registry.save();
  }
  const to = event.params.to;
  let user = User.load(to.toHexString());
  if (!user) {
    log.info("!user", [])
    user = new User(to.toHexString())
    user.balance = BigInt.fromI32(0); // Don't care
    user.registry = registry.id;
  }
  user.updated = event.block.timestamp;
  user.save()
  log.info("handleTransfer done", [])
}

export function handleNewBlock(block: ethereum.Block): void {
  const blockNumber = block.number;
  const twoWeeks = 300; // 3600 * 24 * 14
  if (blockNumber.toI32() % twoWeeks != 0) return;
  let registry = Registry.load(REGISTRY_NAME);
  if (!registry) {
    log.info("handleNewBlock: !registry", [])
    registry = new Registry(REGISTRY_NAME);
    registry.save();
  }
  log.info("handleNewBlock", [])
  const veSheep = VeSheep.bind(Address.fromString(VE_SHEEP_ADDRESS));
  log.warning("veSheep.totalSupply", [veSheep.totalSupply().toString()])

  // New Snapshot
  let snapshot = new Snapshot("snapshot-" + block.number.toHexString())
  snapshot.registry = registry.id;
  snapshot.timestamp = block.timestamp;
  snapshot.stakerAddresses = []
  snapshot.stakerBalances = []
  const users = registry.users;
  if (users.length == 0) return;
  // Todo : Minimum 5 veSheep or minimum of getVotes()
  for (let x = 0; x < users.length; x++) {
    // const user = Address.fromString(users[x]);
    // log.warning("user", [user.toString()]);
    // snapshot.stakerAddresses.push(user);
    // if (veSheep) {
    //   const b = veSheep.balanceOf(user);
    // snapshot.stakerBalances.push(b);
    //   log.info("b", [b.toString()])
    // }
  }
  snapshot.save();
  registry.save();
}


// 