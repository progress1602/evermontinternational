/**
 * GraphQL Core Fetch Engine for Evermont International Bank
 * Pure HTTP fetch implementation without external Apollo Client dependency
 */

const GRAPHQL_URL = 'https://manual-bank.onrender.com/graphql';

export interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

export async function graphqlFetch<T = any>(query: string, variables: any = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Network response error: ${response.status}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    // If errors are specifically about the restricted "ssn" field, ignore them so login/register/profile fetching doesn't block the user
    const realErrors = result.errors.filter(err => {
      if (err.path && err.path.includes('ssn')) return false;
      return true;
    });
    if (realErrors.length > 0) {
      throw new Error(realErrors[0].message || 'Execution error during query parsing.');
    }
  }

  if (!result.data) {
    throw new Error('No data received from sovereign uplink.');
  }

  return result.data;
}

// 1. REGISTER MUTATION
export const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      message
      token
      user {
        id
        email
        username
        ssn
        occupation
        address
        country
        stateProvince
        city
        isVerified
        zipPostalCode
        profileImage
        currencyProtocol
        accountTier
        accountNumber
        totalDeposits
        totalWithdrawals
        totalTransfers
        accountStatus
        emailNotifications
        smsNotifications
        pushNotifications
        role
        kycStatus
        createdAt
        updatedAt
      }
    }
  }
`;

// 2. LOGIN MUTATION
export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
      user {
        id
        email
        username
        ssn
        occupation
        address
        country
        stateProvince
        city
        isVerified
        zipPostalCode
        profileImage
        currencyProtocol
        accountTier
        accountNumber
        totalDeposits
        totalWithdrawals
        totalTransfers
        accountStatus
        emailNotifications
        smsNotifications
        pushNotifications
        role
        kycStatus
        createdAt
        updatedAt
      }
    }
  }
`;

// 3. PROFILE QUERY
export const PROFILE_QUERY = `
  query Profile {
    profile {
      id
      email
      username
      ssn
      occupation
      address
      country
      stateProvince
      city
      isVerified
      zipPostalCode
      profileImage
      currencyProtocol
      accountTier
      accountNumber
      totalDeposits
      totalWithdrawals
      totalTransfers
      accountStatus
      emailNotifications
      smsNotifications
      pushNotifications
      role
      kycStatus
      createdAt
      updatedAt
      firstName
      lastName
      phoneNumber
      primaryBalance
      tertiaryBalance
      secondaryBalance
      totalBalance
    }
  }
`;

// 4. MY TRANSACTIONS QUERY
export const MY_TRANSACTIONS_QUERY = `
  query MyTransactions {
    myTransactions {
      id
      userId
      transactionId
      transactionType
      amount
      fee
      currency
      reference
      status
      direction
      description
      recipientName
      recipientBank
      recipientAccountNumber
      proofOfPayment
      paymentLinkUsed
      remarks
      processedBy
      processedAt
      createdAt
      updatedAt
    }
  }
`;

// 5. UPDATE PROFILE MUTATION
export const UPDATE_PROFILE_MUTATION = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      firstName
      lastName
      email
      username
      phoneNumber
      occupation
      address
      country
      stateProvince
      city
      zipPostalCode
      profileImage
      currencyProtocol
    }
  }
`;

// 6. NOTIFICATIONS QUERY
export const NOTIFICATIONS_QUERY = `
  query Notifications {
    notifications {
      id
      title
      message
      type
      isRead
      createdAt
      updatedAt
    }
  }
`;

// 7. CREATE DEPOSIT MUTATION
export const CREATE_DEPOSIT_MUTATION = `
  mutation CreateDeposit($input: CreateDepositInput!) {
    createDeposit(input: $input) {
      id
      userId
      amount
      paymentMethod
      proofOfPayment
      reference
      status
      createdAt
      updatedAt
    }
  }
`;

// 8. CREATE WIRE TRANSFER MUTATION
export const CREATE_WIRE_TRANSFER_MUTATION = `
  mutation CreateWireTransfer($input: CreateWireTransferInput!) {
    createWireTransfer(input: $input) {
      id
      userId
      beneficiaryName
      beneficiaryBank
      accountNumber
      swiftCode
      amount
      fee
      reason
      reference
      status
      createdAt
      updatedAt
    }
  }
`;

// 9. CREATE CHARITY MUTATION
export const CREATE_CHARITY_MUTATION = `
  mutation CreateCharity($input: CreateCharityInput!) {
    createCharity(input: $input) {
      id
      userId
      organizationName
      amount
      message
      reference
      status
      createdAt
      updatedAt
    }
  }
`;

// 10. APPLY FOR LOAN MUTATION
export const APPLY_FOR_LOAN_MUTATION = `
  mutation ApplyForLoan($input: CreateLoanInput!) {
    applyForLoan(input: $input) {
      id
      userId
      loanAmount
      interestRate
      durationMonths
      repaymentStatus
      status
      createdAt
      updatedAt
    }
  }
`;

// 11. MY LOANS QUERY
export const MY_LOANS_QUERY = `
  query MyLoans {
    myLoans {
      id
      userId
      loanAmount
      interestRate
      durationMonths
      repaymentStatus
      status
      createdAt
      updatedAt
    }
  }
`;

// 12. MY WIRE TRANSFERS QUERY
export const MY_WIRE_TRANSFERS_QUERY = `
  query MyWireTransfers {
    myWireTransfers {
      id
      userId
      beneficiaryName
      beneficiaryBank
      accountNumber
      swiftCode
      amount
      fee
      reason
      reference
      status
      createdAt
      updatedAt
    }
  }
`;

// 13. MY CHARITIES QUERY
export const MY_CHARITIES_QUERY = `
  query MyCharities {
    myCharities {
      id
      userId
      organizationName
      amount
      message
      reference
      status
      createdAt
      updatedAt
    }
  }
`;

// 14. CREATE GRANT MUTATION
export const CREATE_GRANT_MUTATION = `
  mutation CreateGrant($input: CreateGrantInput!) {
    createGrant(input: $input) {
      id
      grantId
      userId
      grantType
      grantTitle
      businessName
      federalTaxId
      industrySector
      amount
      purpose
      status
      remarks
      processedBy
      processedAt
      createdAt
      updatedAt
    }
  }
`;

// 15. MY GRANTS QUERY
export const MY_GRANTS_QUERY = `
  query MyGrants {
    myGrants {
      id
      grantId
      userId
      grantType
      grantTitle
      businessName
      federalTaxId
      industrySector
      amount
      purpose
      status
      remarks
      processedBy
      processedAt
      createdAt
      updatedAt
    }
  }
`;

// 16. BALANCE MUTATIONS
export const CREDIT_USER_BALANCE_MUTATION = `
  mutation CreditUserBalance($input: BalanceUpdateInput!) {
    creditUserBalance(input: $input) {
      id
    }
  }
`;

export const DEBIT_USER_BALANCE_MUTATION = `
  mutation DebitUserBalance($input: BalanceUpdateInput!) {
    debitUserBalance(input: $input) {
      id
    }
  }
`;



