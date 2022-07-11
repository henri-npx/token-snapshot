import { Address, BigInt } from "@graphprotocol/graph-ts"
import { VeSheep, Approval, Transfer } from "../src/types/VeSheep/VeSheep"
import { User } from "../src/types/schema"
import { ByteArray, log, DataSourceTemplate, DataSourceContext, ethereum, Bytes } from "@graphprotocol/graph-ts";
import { REGISTRY_NAME, VE_SHEEP_ADDRESS } from './helpers';
import { Registry } from './types/schema';
import { NULL_ADDRESS } from '../../../solidity/test/helpers/core';

export function handleTransfer(event: Transfer): void {
  // Registry
  let registry = Registry.load(REGISTRY_NAME);
  if (!registry) {
    registry = new Registry(REGISTRY_NAME);
  }
  // veSheep - Not needed
  // const veSheep = VeSheep.bind(Address.fromString(VE_SHEEP_ADDRESS));
  const to = event.params.to;
  const from = event.params.from;
  const amount = event.params.value;
  if (to === Address.fromString(NULL_ADDRESS)) {
    // Burn
    let userFrom = User.load(from.toHex());
    if (!userFrom) return; // Error
    userFrom.balance = userFrom.balance.minus(amount);
    userFrom.updated = BigInt.fromI32(Math.floor(Date.now() / 1000));
    userFrom.save()
  } else {
    // Mint or UsuaL Transfer
    let userTo = User.load(to.toHex());
    if (!userTo) {
      userTo = new User(to.toHex())
      userTo.balance = amount;
      userTo.registry = registry.id;
    } else {
      userTo.balance = userTo.balance.plus(amount);
    }
    userTo.updated = BigInt.fromI32(Math.floor(Date.now() / 1000));
    userTo.save()

    if (from !== Address.fromString(NULL_ADDRESS)) {
      // Not a Mint so we remove 'amount' from the sender
      let userFrom = User.load(from.toHex());
      if (!userFrom) return;
      userFrom = new User(event.transaction.from.toHex())
      userFrom.balance = userFrom.balance.minus(amount);
      userFrom.updated = BigInt.fromI32(Math.floor(Date.now() / 1000));
      userFrom.save()
    }
  }
}