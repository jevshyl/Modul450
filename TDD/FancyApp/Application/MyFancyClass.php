<?php
class MyFancyClass
{
    public function shortString($text, $length, $ending = '...') {
        // 1. Wenn der Text NICHT leer ist und bereits kurz genug, unverändert zurückgeben.
        // Das löst das Problem bei $text35Char mit $length 35 und einer riesigen Endung.
        if ($text !== '' && mb_strlen($text) <= $length) {
            return $text;
        }

        // 2. Wenn der Text gekürzt werden muss (oder leer ist), prüfen wir, ob die Endung hineinpasst.
        // Passt die Endung nicht in die maximale Länge, brechen wir mit false ab.
        if ($length <= mb_strlen($ending)) {
            return false;
        }

        // 3. Wenn der Text leer ist und die Endung hineinpasst, geben wir leer zurück.
        if ($text === '') {
            return '';
        }

        // 4. Text kürzen und Endung anhängen.
        // Wir nutzen mb_substr, damit das 'ä' nicht zerschnitten wird.
        return mb_substr($text, 0, $length - mb_strlen($ending)) . $ending;
    }

    /**
     * Berechnet den Durchschnittswert eines Arrays.
     */
    public function calcAverage($values) {
        if (empty($values)) {
            return 0;
        }

        $sum = 0;
        foreach ($values as $value) {
            if (!is_numeric($value)) {
                return false;
            }
            $sum += (float)$value;
        }

        return $sum / count($values);
    }

    /**
     * Wandelt ein Array in einen String oder einen String in ein Array um.
     */
    public function getOpposite($value, $delimiter = ',') {
        if (is_array($value)) {
            return implode($delimiter, $value);
        }
        elseif (is_string($value)) {
            return explode($delimiter, $value);
        }
        else {
            return false;
        }
    }
}