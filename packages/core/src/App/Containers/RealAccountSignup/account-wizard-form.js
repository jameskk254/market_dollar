let addressDetailsConfig;
let currencySelectorConfig;
let financialDetailsConfig;
let personalDetailsConfig;
let termsOfUseConfig;
let tradingAssessmentConfig;

const isMaltaAccount = ({ real_account_signup_target }) => real_account_signup_target === 'maltainvest';

export const getItems = props => [
    currencySelectorConfig(props, CurrencySelector),
    personalDetailsConfig(props, PersonalDetails),
    addressDetailsConfig(props, AddressDetails),
    ...(isMaltaAccount(props) ? [tradingAssessmentConfig(props, TradingAssessmentNewUser)] : []),
    ...(isMaltaAccount(props) ? [financialDetailsConfig(props, FinancialDetails)] : []),
    termsOfUseConfig(props, TermsOfUse),
];
