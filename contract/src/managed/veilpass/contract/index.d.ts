import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type ProofReceipt = { eligible: boolean;
                             policyId: bigint;
                             issuerVerified: boolean
                           };

export type ProofId = Uint8Array;

export type Witnesses<PS> = {
  getPrivateCredential(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, { birthYear: bigint,
                                                                                     issuerVerified: boolean,
                                                                                     nonce: Uint8Array
                                                                                   }];
}

export type ImpureCircuits<PS> = {
  createEligibilityProof(context: __compactRuntime.CircuitContext<PS>,
                         currentYear_0: bigint,
                         minimumAge_0: bigint,
                         policyId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  createEligibilityProof(context: __compactRuntime.CircuitContext<PS>,
                         currentYear_0: bigint,
                         minimumAge_0: bigint,
                         policyId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
  deriveProofId(credential_0: { birthYear: bigint,
                                issuerVerified: boolean,
                                nonce: Uint8Array
                              },
                currentYear_0: bigint,
                minimumAge_0: bigint,
                policyId_0: bigint): ProofId;
}

export type Circuits<PS> = {
  deriveProofId(context: __compactRuntime.CircuitContext<PS>,
                credential_0: { birthYear: bigint,
                                issuerVerified: boolean,
                                nonce: Uint8Array
                              },
                currentYear_0: bigint,
                minimumAge_0: bigint,
                policyId_0: bigint): __compactRuntime.CircuitResults<PS, ProofId>;
  createEligibilityProof(context: __compactRuntime.CircuitContext<PS>,
                         currentYear_0: bigint,
                         minimumAge_0: bigint,
                         policyId_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  proofs: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: ProofId): boolean;
    lookup(key_0: ProofId): ProofReceipt;
    [Symbol.iterator](): Iterator<[ProofId, ProofReceipt]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
