package ch.schule.bank.junit5;

import ch.schule.Account;
import ch.schule.Bank;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;


/**
 * Tests f�r die Klasse 'Bank'.
 *
 * @author xxxx
 * @version 1.0
 */
public class BankTests {
    /**
     * Tests to create new Accounts
     */
    @Test
    public void testCreate() {

        Bank bank = new Bank();

        assertEquals("S-1000", bank.createSavingsAccount());
        assertEquals("Y-1001", bank.createPromoYouthSavingsAccount());
        assertEquals("P-1002", bank.createSalaryAccount(-3000));
    }
    /**
     * Testet das Einzahlen auf ein Konto.
     */
    @Test
    public void testDeposit() {
        Bank bank = new Bank();

        assertEquals("S-1000", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1000", 13576, 1200));
    }
    /**
     * Testet das Abheben von einem Konto.
     */
    @Test
    public void testWithdraw() {
        Bank bank = new Bank();

        assertEquals("S-1000", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1000", 13576, 1200));
        assertTrue(bank.withdraw("S-1000", 13576, 1200));
    }

    /**
     * Experimente mit print().
     */
    @Test
    public void testPrint() {
        Bank bank = new Bank();

        assertEquals("S-1000", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1000", 13576, 1200));
        assertTrue(bank.withdraw("S-1000", 13576, 1200));

        bank.print("S-1000");
    }

    /**
     * Experimente mit print(year, month).
     */
    @Test
    public void testMonthlyPrint() {
        Bank bank = new Bank();

        assertEquals("S-1000", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1000", 13576, 1200));

        assertEquals("P-1001", bank.createSalaryAccount(0));
        assertTrue(bank.deposit("P-1001", 13576, 1200));

        assertEquals("Y-1002", bank.createPromoYouthSavingsAccount());
        assertTrue(bank.deposit("Y-1002", 13576, 1200));

        bank.print("S-1000", 2007, 9);
    }

    /**
     * Testet den Gesamtkontostand der Bank.
     */
    @Test
    public void testBalance() {
        Bank bank = new Bank();

        assertEquals("S-1000", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1000", 13576, 1200));

        assertEquals("P-1001", bank.createSalaryAccount(0));
        assertTrue(bank.deposit("P-1001", 13576, 1200));

        assertEquals("Y-1002", bank.createPromoYouthSavingsAccount());
        assertTrue(bank.deposit("Y-1002", 13576, 1200));

        assertEquals(-3612, bank.getBalance());
    }

    /**
     * Tested die Ausgabe der "top 5" konten.
     */
    @Test
    public void testTop5() {
        Bank bank = new Bank();

        assertEquals("S-1000", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1000", 13576, 1200));

        assertEquals("P-1001", bank.createSalaryAccount(-3000));
        assertTrue(bank.deposit("P-1001", 13576, 1200));

        assertEquals("Y-1002", bank.createPromoYouthSavingsAccount());
        assertTrue(bank.deposit("Y-1002", 13576, 1200));

        assertEquals("S-1003", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1003", 13576, 1200));

        assertEquals("P-1004", bank.createSalaryAccount(-3000));
        assertTrue(bank.deposit("P-1004", 13576, 1200));

        assertEquals("Y-1005", bank.createPromoYouthSavingsAccount());
        assertTrue(bank.deposit("Y-1005", 13576, 1200));

        assertEquals("S-1006", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1006", 13576, 9200));

        assertEquals("P-1007", bank.createSalaryAccount(-3000));
        assertTrue(bank.deposit("P-1007", 13576, 1800));

        assertEquals("Y-1008", bank.createPromoYouthSavingsAccount());
        assertTrue(bank.deposit("Y-1008", 13576, 6200));

        bank.printTop5();
    }

    /**
     * Tested die Ausgabe der "top 5" konten.
     */
    @Test
    public void testBottom5() {
        Bank bank = new Bank();

        assertEquals("S-1000", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1000", 13576, 1200));

        assertEquals("P-1001", bank.createSalaryAccount(-3000));
        assertTrue(bank.deposit("P-1001", 13576, 1200));

        assertEquals("Y-1002", bank.createPromoYouthSavingsAccount());
        assertTrue(bank.deposit("Y-1002", 13576, 1200));

        assertEquals("S-1003", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1003", 13576, 1200));

        assertEquals("P-1004", bank.createSalaryAccount(-3000));
        assertTrue(bank.deposit("P-1004", 13576, 1200));

        assertEquals("Y-1005", bank.createPromoYouthSavingsAccount());
        assertTrue(bank.deposit("Y-1005", 13576, 1200));

        assertEquals("S-1006", bank.createSavingsAccount());
        assertTrue(bank.deposit("S-1006", 13576, 9200));

        assertEquals("P-1007", bank.createSalaryAccount(-3000));
        assertTrue(bank.deposit("P-1007", 13576, 1800));

        assertEquals("Y-1008", bank.createPromoYouthSavingsAccount());
        assertTrue(bank.deposit("Y-1008", 13576, 6200));

        bank.printBottom5();
    }

}
