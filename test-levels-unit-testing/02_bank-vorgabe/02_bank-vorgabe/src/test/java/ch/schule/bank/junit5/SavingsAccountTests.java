package ch.schule.bank.junit5;

import ch.schule.SalaryAccount;
import ch.schule.SavingsAccount;



/**
 * Tests f�r die Klasse SavingsAccount.
 *
 * @author Roger H. J&ouml;rg
 * @version 1.0
 */

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;


/**
 * Tests für die Klasse SavingsAccount.
 *
 * @author XXX
 * @version 1.0
 */
public class SavingsAccountTests
{
	@Test
	public void testWithdraw() {
		SavingsAccount account = new SavingsAccount("S-1000");

		assertTrue(account.deposit(10, 1000));
		assertTrue(account.withdraw(10, 1000));
		assertFalse(account.withdraw(10, 1000));
	}
}

