declare module 'emv'
{
  import { ByteArray, Kind, Component, EndPoint } from 'cryptographix-sim-core';
  import { Crypto, Key, CommandAPDU, ResponseAPDU, JSIMScriptApplet, JSIMSlot, JSIMScriptCard, SlotProtocolHandler, ByteString, TLV } from 'cryptographix-se-core';

  export enum EMV {
      CLA_EMV = 128,
      INS_GET_CHALLENGE = 132,
      INS_BLOCK_APPLICATION = 30,
      INS_UNBLOCK_APPLICATION = 24,
      INS_UNBLOCK_CHANGE_PIN = 36,
      INS_GET_PROCESSING_OPTIONS = 168,
      INS_GENERATE_AC = 174,
      P2_PIN_TYPE_PLAIN = 128,
      P2_PIN_TYPE_ENCIPHERED = 136,
      TAG_PAYMENT_SYSTEM_DIRECTORY_RECORD = 112,
      TAG_APPLICATION_DIR_DISCRETIONARY_TEMPLATE = 115,
      TAG_DF_NAME = 132,
      TAG_DDF_NAME = 157,
      TAG_FCI_ISSUER_DISCRETIONARY_DATA_TEMPLATE = 48908,
      TAG_FCI_LOG_ENTRY = 40781,
      TAG_ADF_NAME = 79,
      TAG_APPLICATION_PREFERRED_NAME = 40722,
      TAG_APPLICATION_PRIORITY_INDICATOR = 135,
      TAG_SFI = 136,
      TAG_ISSUER_CODE_TABLE_INDEX = 40721,
      TAG_ADDITIONAL_TERMINAL_CAPABILITIES = 40768,
      TAG_AFL = 148,
      TAG_AID_TERMINAL = 40710,
      TAG_AIP = 130,
      TAG_AMOUNT_AUTHORIZED = 40706,
      TAG_AMOUNT_AUTHORIZED_BIN = 129,
      TAG_AMOUNT_OTHER = 40707,
      TAG_AMOUNT_OTHER_BIN = 40708,
      TAG_APPLICATION_CRYPTOGRAM = 40742,
      TAG_APPLICATION_CURRENCY_CODE = 40770,
      TAG_APPLICATION_CURRENCY_EXPONENT = 40772,
      TAG_APPLICATION_REFERENCE_CURRENCY_EXPONENT = 40771,
      TAG_APPLICATION_DATA_TEMPLATE = 112,
      TAG_APPLICATION_DISCRETIONARY_DATA = 40709,
      TAG_APPLICATION_REFERENCE_CURRENCY = 40763,
      TAG_APPLICATION_USAGE_CONTROL = 40711,
      TAG_APPLICATION_VERSION_NUMBER = 40712,
      TAG_ATC = 40758,
      TAG_AUTHORIZATION_CODE = 137,
      TAG_AUTHORIZATION_RESPONSE_CODE = 138,
      TAG_CARDHOLDER_NAME_EXTENDED = 40715,
      TAG_CDOL1 = 140,
      TAG_CDOL2 = 141,
      TAG_CERTIFICATION_AUTHORITY_PK_TERMINAL = 40738,
      TAG_CERTIFICATION_AUTHORITY_PUBLIC_KEY_INDEX = 143,
      TAG_COMMAND_FORMAT = 131,
      TAG_CRYPTOGRAM_INFORMATION_DATA = 40743,
      TAG_CVM_LIST = 142,
      TAG_CVM_RESULTS = 40756,
      TAG_DATA_AUTHENTICATION_CODE = 40773,
      TAG_DDOL = 40777,
      TAG_IAC_DEFAULT = 40717,
      TAG_IAC_DENIAL = 40718,
      TAG_IAC_ONLINE = 40719,
      TAG_ICC_DYNAMIC_NUMBER = 40780,
      TAG_ICC_PUBLIC_KEY_CERTIFICATE = 40774,
      TAG_ICC_PUBLIC_KEY_EXPONENT = 40775,
      TAG_ICC_PUBLIC_KEY_REMAINDER = 40776,
      TAG_ISSUER_APPLICATION_DATA = 40720,
      TAG_ISSUER_AUTHENTICATION_DATA = 145,
      TAG_ISSUER_PUBLIC_KEY_CERTIFICATE = 144,
      TAG_ISSUER_PUBLIC_KEY_EXPONENT = 40754,
      TAG_ISSUER_PUBLIC_KEY_REMAINDER = 146,
      TAG_ISSUER_SCRIPT_COMMAND = 134,
      TAG_ISSUER_SCRIPT_IDENTIFIER = 40728,
      TAG_LATC = 40723,
      TAG_LOWER_CONSECUTIVE_OFFLINE_LIMIT = 40724,
      TAG_PDOL = 40760,
      TAG_PIN_ENCIPHER_PUBLIC_KEY_CERTIFICATE = 40749,
      TAG_PIN_ENCIPHER_PUBLIC_KEY_EXPONENT = 40750,
      TAG_PIN_ENCIPHER_PUBLIC_KEY_REMAINDER = 40751,
      TAG_POS_ENTRY_MODE = 40761,
      TAG_PTC = 40727,
      TAG_RESPONSE_FORMAT1_PRIMITIVE = 128,
      TAG_RESPONSE_FORMAT2_TEMPLATE = 119,
      TAG_SCRIPT_TEMPLATE1 = 113,
      TAG_SCRIPT_TEMPLATE2 = 114,
      TAG_SDOL = 40778,
      TAG_SIGNED_DYNAMIC_APPLICATION_DATA = 40779,
      TAG_SIGNED_STATIC_APPLICATION_DATA = 147,
      TAG_TCHASH = 152,
      TAG_TDOL = 151,
      TAG_TERMINAL_ACQUIRER_ID = 40705,
      TAG_TERMINAL_COUNTRY_CODE = 40730,
      TAG_TERMINAL_FLOOR_LIMIT = 40731,
      TAG_TERMINAL_ID = 40732,
      TAG_TERMINAL_IFD_SERIALNUMBER = 40734,
      TAG_TERMINAL_CAPABILITIES = 40755,
      TAG_TERMINAL_SEQUENCE_NUMBER = 40769,
      TAG_TERMINAL_TYPE = 40757,
      TAG_TERMINAL_UNPREDICTABLE_NUMBER = 40759,
      TAG_TERMINAL_VERSION_NUMBER = 40713,
      TAG_TERMINAL_MERCHANT_CATEGORY_CODE = 40725,
      TAG_TERMINAL_MERCHANT_ID = 40726,
      TAG_TERMINAL_MERCHANT_NAME_AND_LOCATION = 40782,
      TAG_TERMINAL_RISK_MANAGEMENT_DATA = 40733,
      TAG_TRACK1_DISC_DATA = 40735,
      TAG_TRACK2_DISC_DATA = 40736,
      TAG_TRANSACTION_DATE = 154,
      TAG_TRANSACTION_PIN_DATA = 153,
      TAG_TRANSACTION_REFERENCE_AMOUNT = 40762,
      TAG_TRANSACTION_REFERENCE_CURRENCY = 40764,
      TAG_TRANSACTION_REFERENCE_EXPONENT = 40765,
      TAG_TRANSACTION_TIME = 40737,
      TAG_TRANSACTION_TYPE = 156,
      TAG_TSI = 155,
      TAG_TVR = 149,
      TAG_UPPER_CONSECUTIVE_OFFLINE_LIMIT = 40739,
      SW_PIN_BLOCKED = 27011,
      CID_CRYPTOGRAM_TYPE_MASK = 192,
      CID_AAC = 0,
      CID_TC = 64,
      CID_ARQC = 128,
      CID_AAR = 192,
      CID_ADVICE_REQUIRED_BIT = 8,
      CID_REASON_TYPE_MASK = 7,
      CID_REASON_SVC_NOT_ALLOWED = 1,
      CID_REASON_PTC_ZERO = 2,
  }

  export class EMVAuthSimulator {
      myNode: any;
      setupNode(node: any, config: any): void;
      teardownNode(): void;
      onPacket(port: any, packet: any): void;
  }

  export interface CardDataStore {
      getDGI(tag: number): ByteArray;
  }


  export class AppletCore {
      oCrypto: Crypto;
      sPAN: string;
      sPANSequence: string;
      static _wATC: number;
      _wATC: number;
      _kCardACKey: Key;
      _bsPINBlock: ByteArray;
      _wPTC: number;
      dataStore: CardDataStore;
      constructor(dataStore: CardDataStore);
      exchangeAPDU(commandAPDU: CommandAPDU): Promise<ResponseAPDU>;
      init(): void;
      private deriveCardKey(kMasterKey, sPAN, sPANSequence);
      private deriveSessionKey(kCardKey, baUN);
      private computeApplicationCryptogram(baUN, baDataToSign);
      doGetProcessingOptions(bP1: number, bP2: number, commandData: ByteArray): ResponseAPDU;
      doReadRecord(bP1: number, bP2: number, commandData: ByteArray): ResponseAPDU;
      doVerify(bP1: any, bP2: any, commandData: ByteArray): ResponseAPDU;
      doGenerateAC(bP1: number, bP2: number, commandData: ByteArray): ResponseAPDU;
      dispatchEMV(bCLA: any, bINS: any, bP1: any, bP2: any, commandData: any, wLe: any): ResponseAPDU;
      doStoreData(bP1: any, bP2: any, commandData: any): number;
  }


  export class JSIMEMVApplet extends JSIMScriptApplet {
      core: AppletCore;
      constructor();
      selectApplication(commandAPDU: CommandAPDU): Promise<ResponseAPDU>;
      executeAPDU(commandAPDU: CommandAPDU): Promise<ResponseAPDU>;
      deselectAppication(): void;
  }

  export class EMVCardSimulator implements Component {
      _config: {};
      _slot: JSIMSlot;
      _card: JSIMScriptCard;
      _cardHandler: SlotProtocolHandler;
      _apduIn: EndPoint;
      private _node;
      constructor(node: Node);
      initialize(config: {}): EndPoint[];
      teardown(): void;
      start(): void;
      stop(): void;
  }
  export class CardConfig implements Kind {
      onlineOnly: boolean;
      offlineDataAuth: OfflineDataAuthentication;
      profile: string;
  }
  export enum OfflineDataAuthentication {
      NOODA = 0,
      SDA = 1,
      DDA = 2,
      CDA = 3,
  }

  export class TLVParser {
      private bsTLV;
      private offsetTLV;
      private lengthTLV;
      private offsetTemp;
      constructor(tlvString?: ByteString);
      setTLV(tlv: ByteString | TLV): void;
      nextByte(): number;
      peekByte(): number;
      skipPadding(): void;
      isEOF(): boolean;
      getTag(bGetLengthOfTag?: any): any;
      getLength(): any;
      getValue(iLength: any): ByteString;
      getTLV(): ByteString;
  }

  export class EMVCommandHelper {
      cardReader: any;
      commandID: any;
      commandName: any;
      commandBuffer: any;
      responseBuffer: any;
      constructor(cardReader: any);
      private _buildAPDU(byteCLA, byteINS, byteP1, byteP2, commandData, byteLe?);
      buildSelectApplication(aidData: any): any;
      buildGetProcessingOptions(pdolData: any): any;
      buildReadRecord(shortFileIndicator: any, recordNum: any): any;
      buildVerify(pinType: any, pinData: any): any;
      buildGenerateAC(bCID: any, gacData: any): any;
      apduCommand: any;
      apduResponse: any;
      onAPDUResponse: any;
      tlvArray: any;
      getAPDUCommand(): any;
      executeAPDUCommand(onAPDUResponse: any): void;
      setTag(wTag: any, aValue: any): void;
      storeTemplate(aTemplate: any): void;
      parseSelectFile(SW12: any, responseBuffer: any): void;
      parseGetProcessingOptions(SW12: any, responseBuffer: any): void;
      parseReadRecord(SW12: any, responseBuffer: any): void;
      parseGenerateAC(SW12: any, responseBuffer: any): void;
      SW12: any;
      handleAPDUResponse(SW12: any, responseBuffer: any): void;
      static cmdSelectFile: string;
      static cmdGetProcessingOptions: string;
      static cmdReadRecord: string;
      static cmdGetData: string;
      static cmdInternalAuthenticate: string;
      static cmdVerify: string;
      static cmdGenerateAC: string;
      static cmdExternalAuthenticate: string;
  }


  export class EMVApplicationKernel {
      cardReader: any;
      commandHelper: EMVCommandHelper;
      kernelParams: {};
      initKernel(reader: any): void;
      getParam(paramName: any): any;
      setParam(paramName: any, newValue: any): void;
      tlvArray: any[];
      setTLV(aTLV: any, doRecursive: any): void;
      clearTags(): void;
      getTag(wTag: any, wDefaultLen?: any): any;
      setTag(wTag: any, sValue: any): void;
      formatDOL(sDOLSpec: any): ByteString;
      getTLVList(sTagList: any): ByteString;
      doGenerateAC(onAPDUResponse: any): void;
      onAPDUResponse(apduResponse: any): void;
  }

  export class EMVPOSSimulator implements Component {
      private _emvKernel;
      constructor();
      private _toCard;
      private _toNetwork;
      initialize(config: Kind): EndPoint[];
      teardown(): void;
      onPacket(port: any, packet: any): void;
      getAPDUCommandProxy(): {
          executeAPDUCommand: (bCLA: any, bINS: any, bP1: any, bP2: any, commandData: any, wLe: any, onAPDUResponse: any) => any;
      };
      resetTransaction(): void;
      apduCommandMonitor: any;
      showAPDUCommand(cmd: any): void;
      apduResponseMonitor: any;
      handleAPDUResponse(responseInfo: any): void;
      advanceCommandStep(): void;
      curStep: any;
      rec: any;
      executeStep(nextStep: any): void;
      getStep(): any;
      setAPDUCommandMonitor(monitor: any): void;
      setAPDUResponseMonitor(monitor: any): void;
      getKernel(): any;
  }

}
