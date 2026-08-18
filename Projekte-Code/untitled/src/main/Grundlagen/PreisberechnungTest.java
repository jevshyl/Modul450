package Grundlagen;

public class PreisberechnungTest {

    double calculatePrice(double baseprice, double specialprice, double extraprice, int extras, double discount) {
        double addon_discount;
        double result;

        if (extras >= 5)
            addon_discount = 15;
        else if (extras >= 3)
            addon_discount = 10;
        else
            addon_discount = 0;

        if (discount > addon_discount)
            addon_discount = discount;

        result = baseprice/100.0 * (100-discount) + specialprice
                 + extraprice/100.0 * (100-addon_discount);

        return result;
    }

    boolean test_calculate_price() {
        double price;
        boolean test_ok = true;

        price = calculatePrice(1000, 0, 0, 0, 0);
        if (price != 1000) {
            System.out.println("Test 1 fehlgeschlagen: erwartet 1000, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 0, 200, 2, 0);
        if (price != 1200) {
            System.out.println("Test 2 fehlgeschlagen: erwartet 1200, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 0, 200, 3, 0);
        if (price != 1180) {
            System.out.println("Test 3 fehlgeschlagen: erwartet 1180, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 0, 200, 5, 0);
        if (price != 1170) {
            System.out.println("Test 4 fehlgeschlagen: erwartet 1170, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 0, 0, 0, 10);
        if (price != 900) {
            System.out.println("Test 5 fehlgeschlagen: erwartet 900, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 300, 0, 0, 0);
        if (price != 1300) {
            System.out.println("Test 6 fehlgeschlagen: erwartet 1300, erhalten " + price);
            test_ok = false;
        }

        price = calculatePrice(1000, 300, 200, 5, 10);
        if (price != 1370) {
            System.out.println("Test 7 fehlgeschlagen: erwartet 1370, erhalten " + price);
            test_ok = false;
        }

        return test_ok;
    }

    public static void main(String[] args) {
        PreisberechnungTest t = new PreisberechnungTest();
        boolean result = t.test_calculate_price();
        System.out.println(result ? "Alle Tests bestanden" : "Es gibt fehlgeschlagene Tests");
    }
}