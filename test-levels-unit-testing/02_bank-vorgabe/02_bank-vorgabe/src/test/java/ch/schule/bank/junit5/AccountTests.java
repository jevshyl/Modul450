package ch.schule.bank.junit5;

import ch.schule.Account;
import ch.schule.SalaryAccount;
import ch.schule.SavingsAccount;
import org.junit.jupiter.api.Test;


import java.util.TreeMap;

import static org.junit.jupiter.api.Assertions.*;


/**
 * Tests für die Klasse Account.
 *
 * @author xxxx
 * @version 1.0
 */
public class AccountTests {
    /**
     * Tested die Initialisierung eines Kontos.
     */


    @Test
    public void testInit() {
        Account account = new Account("A-1000") {};

        assertEquals("A-1000", account.getId());
        assertEquals(0, account.getBalance());
    }

    /**
     * Testet das Einzahlen auf ein Konto.
     */
    @Test
    public void testDeposit() {
        Account account = new Account("A-1100") {};

        assertTrue(account.deposit(21, 500));
        assertEquals(500, account.getBalance());
    }

    /**
     * Testet das Abheben von einem Konto.
     */
    @Test
    public void testWithdraw() {
        Account account = new Account("A-1200") {};
        account.deposit(21, 1000);

        assertTrue(account.withdraw(21, 500));
        assertEquals(500, account.getBalance());


        assertFalse(account.withdraw(2, -100));
        assertEquals(500, account.getBalance());
    }

    /**
     * Tests the reference from SavingsAccount
     */
    @Test
    public void testReferences() {
        SavingsAccount savings = new SavingsAccount("S-1000");
        savings.deposit(0, 1000);

        assertFalse(savings.withdraw(1, 2000));
        assertEquals(1000, savings.getBalance());

        assertTrue(savings.withdraw(1, 500));
        assertEquals(500, savings.getBalance());


        SalaryAccount  salaryAccount = new SalaryAccount("S-2000", -3000);
        salaryAccount.deposit(0, 1000);

        assertTrue(salaryAccount.withdraw(1, 2000));
        assertEquals(-1000, salaryAccount.getBalance());

        assertFalse(salaryAccount.withdraw(1, 4000));
        assertEquals(-1000, salaryAccount.getBalance());
    }
}
