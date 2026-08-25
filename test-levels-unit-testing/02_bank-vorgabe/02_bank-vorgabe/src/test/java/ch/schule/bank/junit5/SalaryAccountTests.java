package ch.schule.bank.junit5;

import ch.schule.PromoYouthSavingsAccount;
import ch.schule.SalaryAccount;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;


/**
 * Tests der Klasse SalaryAccount.
 *
 * @author XXX
 * @version 1.1
 */
public class SalaryAccountTests
{
	/**
	 * Der Test.
	 */
	@Test
	public void testWithdraw() {
		SalaryAccount account = new SalaryAccount("P-1000", -1000);

		assertTrue(account.deposit(10, 1000));
		assertTrue(account.withdraw(10, 1000));
		assertTrue(account.withdraw(10, 1000));
		assertFalse(account.withdraw(10, 1000));
	}
}
