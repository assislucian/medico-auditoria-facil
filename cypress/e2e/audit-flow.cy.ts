
describe('Audit Process Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Login before each test
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Wait for dashboard to load
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });
  
  it('should upload a guide and view analysis', () => {
    // Navigate to uploads page
    cy.visit('/uploads');
    cy.contains('Upload de Documentos').should('be.visible');
    
    // Upload guide file
    cy.get('[data-test="dropzone-guia"]').attachFile({
      filePath: 'fixtures/test-guide.pdf',
      fileName: 'guide.pdf',
      mimeType: 'application/pdf'
    });
    
    // Check if file was uploaded
    cy.contains('guide.pdf').should('be.visible');
    
    // Process the file
    cy.get('button').contains('Processar Documentos').click();
    
    // Wait for processing to complete
    cy.contains('Processamento concluído', { timeout: 10000 }).should('be.visible');
    
    // View comparison results
    cy.get('button').contains('Ver Comparativo').click();
    
    // Should redirect to comparison page
    cy.url().should('include', '/compare');
    cy.contains('Comparativo de Pagamentos').should('be.visible');
  });
  
  it('should navigate to analysis page and generate contestation', () => {
    // Navigate to history page
    cy.visit('/history');
    
    // Click on first analysis result
    cy.get('[data-test="analysis-item"]').first().click();
    
    // Should show analysis details
    cy.contains('Análise de Guia').should('be.visible');
    
    // Check if audit table is visible
    cy.get('table').should('be.visible');
    
    // Select underpaid procedures
    cy.get('input[type="checkbox"]').first().check();
    
    // Generate contestation
    cy.contains('Gerar Contestação').click();
    
    // Should show success message
    cy.contains('Contestação gerada com sucesso').should('be.visible');
  });
  
  it('should navigate to divergences page', () => {
    // Navigate to divergences page
    cy.visit('/divergences');
    
    // Check if page loaded correctly
    cy.contains('Procedimentos não Pagos').should('be.visible');
    
    // Check if divergence table is visible
    cy.get('table').should('exist');
  });
});
