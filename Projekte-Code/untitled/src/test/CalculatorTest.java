import Unit.Calculator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class CalculatorTest {

    private Calculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }


    /* Addition */

    @Test
    @DisplayName("Addition zweier positiver Zahlen")
    void add_zweiPositiveZahlen() {
        assertEquals(8.0, calculator.add(5.0, 3.0));
    }

    @Test
    @DisplayName("Addition mit negativer Zahl")
    void add_mitNegativerZahl() {
        assertEquals(2.0, calculator.add(5.0, -3.0));
    }

    @Test
    @DisplayName("Addition mit Null")
    void add_mitNull() {
        assertEquals(5.0, calculator.add(5.0, 0.0));
    }

    /* Subtraktion */

    @Test
    @DisplayName("Subtraktion zweier positiver Zahlen")
    void subtract_zweiPositiveZahlen() {
        assertEquals(2.0, calculator.subtract(5.0, 3.0));
    }

    @Test
    @DisplayName("Subtraktion, die ein negatives Ergebnis liefert")
    void subtract_negativesErgebnis() {
        assertEquals(-2.0, calculator.subtract(3.0, 5.0));
    }

    /* Multiplikation */

    @Test
    @DisplayName("Multiplikation zweier positiver Zahlen")
    void multiply_zweiPositiveZahlen() {
        assertEquals(15.0, calculator.multiply(5.0, 3.0));
    }

    @Test
    @DisplayName("Multiplikation mit Null")
    void multiply_mitNull() {
        assertEquals(0.0, calculator.multiply(5.0, 0.0));
    }

    @Test
    @DisplayName("Multiplikation zweier negativer Zahlen ergibt positiv")
    void multiply_zweiNegativeZahlen() {
        assertEquals(15.0, calculator.multiply(-5.0, -3.0));
    }

    /* Division */

    @Test
    @DisplayName("Division zweier positiver Zahlen")
    void divide_zweiPositiveZahlen() {
        assertEquals(2.5, calculator.divide(5.0, 2.0));
    }

    @Test
    @DisplayName("Division durch Null wirft Exception")
    void divide_durchNull_wirftException() {
        assertThrows(IllegalArgumentException.class, () -> calculator.divide(5.0, 0.0));
    }

    @Test
    @DisplayName("Division mit negativem Divisor")
    void divide_negativerDivisor() {
        assertEquals(-2.5, calculator.divide(5.0, -2.0));
    }
}
