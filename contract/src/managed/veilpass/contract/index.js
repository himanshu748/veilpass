import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = __compactRuntime.CompactTypeBoolean;

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

class _ProofReceipt_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_1.alignment()));
  }
  fromValue(value_0) {
    return {
      eligible: _descriptor_1.fromValue(value_0),
      policyId: _descriptor_2.fromValue(value_0),
      issuerVerified: _descriptor_1.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.eligible).concat(_descriptor_2.toValue(value_0.policyId).concat(_descriptor_1.toValue(value_0.issuerVerified)));
  }
}

const _descriptor_3 = new _ProofReceipt_0();

class _PrivateCredential_0 {
  alignment() {
    return _descriptor_2.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      birthYear: _descriptor_2.fromValue(value_0),
      issuerVerified: _descriptor_1.fromValue(value_0),
      nonce: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_2.toValue(value_0.birthYear).concat(_descriptor_1.toValue(value_0.issuerVerified).concat(_descriptor_0.toValue(value_0.nonce)));
  }
}

const _descriptor_4 = new _PrivateCredential_0();

const _descriptor_5 = new __compactRuntime.CompactTypeBytes(17);

class _tuple_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment())))));
  }
  fromValue(value_0) {
    return [
      _descriptor_5.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_0.fromValue(value_0),
      _descriptor_2.fromValue(value_0),
      _descriptor_2.fromValue(value_0),
      _descriptor_2.fromValue(value_0)
    ]
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0[0]).concat(_descriptor_0.toValue(value_0[1]).concat(_descriptor_0.toValue(value_0[2]).concat(_descriptor_2.toValue(value_0[3]).concat(_descriptor_2.toValue(value_0[4]).concat(_descriptor_2.toValue(value_0[5]))))));
  }
}

const _descriptor_6 = new _tuple_0();

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

class _Either_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_1.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_8 = new _Either_0();

const _descriptor_9 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_10 = new _ContractAddress_0();

const _descriptor_11 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.getPrivateCredential) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getPrivateCredential');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      deriveProofId(context, ...args_1) {
        return { result: pureCircuits.deriveProofId(...args_1), context };
      },
      createEligibilityProof: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`createEligibilityProof: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const currentYear_0 = args_1[1];
        const minimumAge_0 = args_1[2];
        const policyId_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('createEligibilityProof',
                                     'argument 1 (as invoked from Typescript)',
                                     'veilpass.compact line 43 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(currentYear_0) === 'bigint' && currentYear_0 >= 0n && currentYear_0 <= 65535n)) {
          __compactRuntime.typeError('createEligibilityProof',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'veilpass.compact line 43 char 1',
                                     'Uint<0..65536>',
                                     currentYear_0)
        }
        if (!(typeof(minimumAge_0) === 'bigint' && minimumAge_0 >= 0n && minimumAge_0 <= 65535n)) {
          __compactRuntime.typeError('createEligibilityProof',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'veilpass.compact line 43 char 1',
                                     'Uint<0..65536>',
                                     minimumAge_0)
        }
        if (!(typeof(policyId_0) === 'bigint' && policyId_0 >= 0n && policyId_0 <= 65535n)) {
          __compactRuntime.typeError('createEligibilityProof',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'veilpass.compact line 43 char 1',
                                     'Uint<0..65536>',
                                     policyId_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_2.toValue(currentYear_0).concat(_descriptor_2.toValue(minimumAge_0).concat(_descriptor_2.toValue(policyId_0))),
            alignment: _descriptor_2.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._createEligibilityProof_0(context,
                                                        partialProofData,
                                                        currentYear_0,
                                                        minimumAge_0,
                                                        policyId_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      createEligibilityProof: this.circuits.createEligibilityProof
    };
    this.provableCircuits = {
      createEligibilityProof: this.circuits.createEligibilityProof
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('createEligibilityProof', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_11.toValue(0n),
                                                                                              alignment: _descriptor_11.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_2, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_6, value_0);
    return result_0;
  }
  _getPrivateCredential_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getPrivateCredential(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'object' && typeof(result_0.birthYear) === 'bigint' && result_0.birthYear >= 0n && result_0.birthYear <= 65535n && typeof(result_0.issuerVerified) === 'boolean' && result_0.nonce.buffer instanceof ArrayBuffer && result_0.nonce.BYTES_PER_ELEMENT === 1 && result_0.nonce.length === 32)) {
      __compactRuntime.typeError('getPrivateCredential',
                                 'return value',
                                 'veilpass.compact line 24 char 1',
                                 'struct PrivateCredential<birthYear: Uint<0..65536>, issuerVerified: Boolean, nonce: Bytes<32>>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_4.toValue(result_0),
      alignment: _descriptor_4.alignment()
    });
    return result_0;
  }
  _deriveProofId_0(credential_0, currentYear_0, minimumAge_0, policyId_0) {
    const birthYearHash_0 = this._persistentHash_0(credential_0.birthYear);
    return this._persistentHash_1([new Uint8Array([118, 101, 105, 108, 112, 97, 115, 115, 58, 112, 114, 111, 111, 102, 58, 118, 49]),
                                   birthYearHash_0,
                                   credential_0.nonce,
                                   currentYear_0,
                                   minimumAge_0,
                                   policyId_0]);
  }
  _createEligibilityProof_0(context,
                            partialProofData,
                            currentYear_0,
                            minimumAge_0,
                            policyId_0)
  {
    __compactRuntime.assert(minimumAge_0 > 0n && minimumAge_0 <= 125n,
                            'Minimum age is out of range');
    __compactRuntime.assert(currentYear_0 >= minimumAge_0,
                            'Current year is out of range');
    const credential_0 = this._getPrivateCredential_0(context, partialProofData);
    let t_0;
    __compactRuntime.assert((t_0 = credential_0.birthYear, t_0 <= currentYear_0),
                            'Birth year cannot be in the future');
    const cutoffYear_0 = (__compactRuntime.assert(currentYear_0 >= minimumAge_0,
                                                  'result of subtraction would be negative'),
                          currentYear_0 - minimumAge_0);
    let t_1;
    const eligible_0 = credential_0.issuerVerified
                       &&
                       (t_1 = credential_0.birthYear, t_1 <= cutoffYear_0);
    const proofId_0 = this._deriveProofId_0(credential_0,
                                            currentYear_0,
                                            minimumAge_0,
                                            policyId_0);
    const receipt_0 = { eligible: eligible_0,
                        policyId: policyId_0,
                        issuerVerified: credential_0.issuerVerified };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_11.toValue(0n),
                                                                  alignment: _descriptor_11.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(proofId_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(receipt_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    proofs: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_11.toValue(0n),
                                                                                                     alignment: _descriptor_11.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                 alignment: _descriptor_7.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_11.toValue(0n),
                                                                                                     alignment: _descriptor_11.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'veilpass.compact line 22 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_1.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_11.toValue(0n),
                                                                                                     alignment: _descriptor_11.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'veilpass.compact line 22 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_11.toValue(0n),
                                                                                                     alignment: _descriptor_11.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_3.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({
  getPrivateCredential: (...args) => undefined
});
export const pureCircuits = {
  deriveProofId: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`deriveProofId: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const credential_0 = args_0[0];
    const currentYear_0 = args_0[1];
    const minimumAge_0 = args_0[2];
    const policyId_0 = args_0[3];
    if (!(typeof(credential_0) === 'object' && typeof(credential_0.birthYear) === 'bigint' && credential_0.birthYear >= 0n && credential_0.birthYear <= 65535n && typeof(credential_0.issuerVerified) === 'boolean' && credential_0.nonce.buffer instanceof ArrayBuffer && credential_0.nonce.BYTES_PER_ELEMENT === 1 && credential_0.nonce.length === 32)) {
      __compactRuntime.typeError('deriveProofId',
                                 'argument 1',
                                 'veilpass.compact line 26 char 1',
                                 'struct PrivateCredential<birthYear: Uint<0..65536>, issuerVerified: Boolean, nonce: Bytes<32>>',
                                 credential_0)
    }
    if (!(typeof(currentYear_0) === 'bigint' && currentYear_0 >= 0n && currentYear_0 <= 65535n)) {
      __compactRuntime.typeError('deriveProofId',
                                 'argument 2',
                                 'veilpass.compact line 26 char 1',
                                 'Uint<0..65536>',
                                 currentYear_0)
    }
    if (!(typeof(minimumAge_0) === 'bigint' && minimumAge_0 >= 0n && minimumAge_0 <= 65535n)) {
      __compactRuntime.typeError('deriveProofId',
                                 'argument 3',
                                 'veilpass.compact line 26 char 1',
                                 'Uint<0..65536>',
                                 minimumAge_0)
    }
    if (!(typeof(policyId_0) === 'bigint' && policyId_0 >= 0n && policyId_0 <= 65535n)) {
      __compactRuntime.typeError('deriveProofId',
                                 'argument 4',
                                 'veilpass.compact line 26 char 1',
                                 'Uint<0..65536>',
                                 policyId_0)
    }
    return _dummyContract._deriveProofId_0(credential_0,
                                           currentYear_0,
                                           minimumAge_0,
                                           policyId_0);
  }
};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
