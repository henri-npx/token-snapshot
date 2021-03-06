// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Registry extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Registry entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Registry must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Registry", id.toString(), this);
    }
  }

  static load(id: string): Registry | null {
    return changetype<Registry | null>(store.get("Registry", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get users(): Array<string> {
    let value = this.get("users");
    return value!.toStringArray();
  }

  set users(value: Array<string>) {
    this.set("users", Value.fromStringArray(value));
  }

  get snapshots(): Array<string> {
    let value = this.get("snapshots");
    return value!.toStringArray();
  }

  set snapshots(value: Array<string>) {
    this.set("snapshots", Value.fromStringArray(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save User entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type User must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("User", id.toString(), this);
    }
  }

  static load(id: string): User | null {
    return changetype<User | null>(store.get("User", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get registry(): string {
    let value = this.get("registry");
    return value!.toString();
  }

  set registry(value: string) {
    this.set("registry", Value.fromString(value));
  }

  get balance(): BigInt {
    let value = this.get("balance");
    return value!.toBigInt();
  }

  set balance(value: BigInt) {
    this.set("balance", Value.fromBigInt(value));
  }

  get updated(): BigInt {
    let value = this.get("updated");
    return value!.toBigInt();
  }

  set updated(value: BigInt) {
    this.set("updated", Value.fromBigInt(value));
  }
}

export class Snapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Snapshot entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Snapshot must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Snapshot", id.toString(), this);
    }
  }

  static load(id: string): Snapshot | null {
    return changetype<Snapshot | null>(store.get("Snapshot", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get registry(): string {
    let value = this.get("registry");
    return value!.toString();
  }

  set registry(value: string) {
    this.set("registry", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get stakerAddresses(): Array<Bytes> {
    let value = this.get("stakerAddresses");
    return value!.toBytesArray();
  }

  set stakerAddresses(value: Array<Bytes>) {
    this.set("stakerAddresses", Value.fromBytesArray(value));
  }

  get stakerBalances(): Array<BigInt> {
    let value = this.get("stakerBalances");
    return value!.toBigIntArray();
  }

  set stakerBalances(value: Array<BigInt>) {
    this.set("stakerBalances", Value.fromBigIntArray(value));
  }
}
