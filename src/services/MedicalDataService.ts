
import { PaymentStatementService } from './PaymentStatementService';
import { MedicalGuideService } from './MedicalGuideService';
import { ComparisonService } from './ComparisonService';

/**
 * Service responsible for handling medical data processing
 * This is now a facade that delegates to specialized services
 */
export class MedicalDataService {
  // Payment Statement methods
  static processPaymentStatement = PaymentStatementService.processPaymentStatement;
  static savePaymentStatement = PaymentStatementService.savePaymentStatement;
  static getPaymentStatements = PaymentStatementService.getPaymentStatements;
  
  // Medical Guide methods
  static processMedicalGuide = MedicalGuideService.processMedicalGuide;
  static saveMedicalGuide = MedicalGuideService.saveMedicalGuide;
  static getMedicalGuides = MedicalGuideService.getMedicalGuides;
  
  // Comparison methods
  static compareGuideWithStatements = ComparisonService.compareGuideWithStatements;
}
