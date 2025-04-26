
import { PaymentStatementProcessor } from './payment/PaymentStatementProcessor';
import { PaymentStatementStorage } from './payment/PaymentStatementStorage';
import { PaymentStatementRetrieval } from './payment/PaymentStatementRetrieval';
import { PaymentStatementDetailed } from '@/types';

/**
 * Service responsible for handling payment statement processing
 */
export class PaymentStatementService {
  /**
   * Extracts data from a payment statement PDF
   */
  static processPaymentStatement = PaymentStatementProcessor.processPaymentStatement;
  
  /**
   * Saves a processed payment statement to the database
   */
  static savePaymentStatement = PaymentStatementStorage.savePaymentStatement;
  
  /**
   * Retrieves all payment statements for the current user
   */
  static getPaymentStatements = PaymentStatementRetrieval.getPaymentStatements;
}
