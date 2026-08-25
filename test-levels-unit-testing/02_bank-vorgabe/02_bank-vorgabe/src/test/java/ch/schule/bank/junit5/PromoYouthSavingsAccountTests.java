package ch.schule.bank.junit5;

import ch.schule.PromoYouthSavingsAccount;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests für das Promo-Jugend-Sparkonto.
 *
 * @author XXXX
 * @version 1.0
 */
public class PromoYouthSavingsAccountTests
{
	/**
	 * Der Test.
	 */

	@Test
	public void testInit() {
		PromoYouthSavingsAccount account = new PromoYouthSavingsAccount("Y-1000");

		assertEquals("Y-1000", account.getId());
		assertEquals(0, account.getBalance());
	}

	@Test
	public void testDeposit() {
		PromoYouthSavingsAccount account = new PromoYouthSavingsAccount("Y-1000");

		assertTrue(account.deposit(10, 1000));

	}
}
