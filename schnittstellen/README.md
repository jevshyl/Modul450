## Ünung1:
### AddressComarator Korrektur:
```java
import ch.tbz.m450.repository.Address;

import java.util.Comparator;

public class AddressComparator implements Comparator<Address> {

    @Override
    public int compare(Address a1, Address a2) {
        return Comparator
                .comparing(Address::getLastname, Comparator.nullsFirst(String::compareToIgnoreCase))
                .thenComparing(Address::getFirstname, Comparator.nullsFirst(String::compareToIgnoreCase))
                .compare(a1, a2);
    }
}
```
### AddressTest

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class AddressTest {

    private Address address;
    private Date registrationDate;

    @BeforeEach
    void setUp() {
        registrationDate = new Date();
        address = new Address(1, "Max", "Muster", "0791234567", registrationDate);
    }

    @Test
    @DisplayName("AllArgsConstructor setzt alle Felder korrekt")
    void allArgsConstructor_setsAllFields() {
        assertEquals(1, address.getId());
        assertEquals("Max", address.getFirstname());
        assertEquals("Muster", address.getLastname());
        assertEquals("0791234567", address.getPhonenumber());
        assertEquals(registrationDate, address.getRegistrationDate());
    }

    @Test
    @DisplayName("NoArgsConstructor erzeugt ein leeres Objekt ohne Fehler")
    void noArgsConstructor_createsEmptyObject() {
        Address empty = new Address();

        assertEquals(0, empty.getId());
        assertNull(empty.getFirstname());
        assertNull(empty.getLastname());
        assertNull(empty.getPhonenumber());
        assertNull(empty.getRegistrationDate());
    }

    @Test
    @DisplayName("Setter aendern die Werte korrekt (Lombok @Setter)")
    void setters_updateFieldsCorrectly() {
        address.setFirstname("Anna");
        address.setLastname("Beispiel");
        address.setPhonenumber("0791111111");

        assertEquals("Anna", address.getFirstname());
        assertEquals("Beispiel", address.getLastname());
        assertEquals("0791111111", address.getPhonenumber());
    }

    @Test
    @DisplayName("ID kann ueberschrieben werden")
    void setId_updatesId() {
        address.setId(42);
        assertEquals(42, address.getId());
    }
}
```
### AddressComparatorTest
```java
import ch.tbz.m450.repository.Address;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
class AddressComparatorTest {

    private AddressComparator comparator;
    private Address anna;
    private Address bernd;
    private Address annaZweite; // gleicher Nachname wie "anna" -> testet thenComparing

    @BeforeEach
    void setUp() {
        comparator = new AddressComparator();
        anna = new Address(1, "Anna", "Anderegg", "079", new Date());
        bernd = new Address(2, "Bernd", "Berger", "078", new Date());
        annaZweite = new Address(3, "Zoe", "Anderegg", "077", new Date());
    }

    @Test
    @DisplayName("Adresse mit fruehstem Nachnamen kommt zuerst")
    void compare_sortsByLastnameAscending() {
        assertTrue(comparator.compare(anna, bernd) < 0, "Anderegg sollte vor Berger stehen");
        assertTrue(comparator.compare(bernd, anna) > 0, "Berger sollte nach Anderegg stehen");
    }

    @Test
    @DisplayName("Gleicher Nachname wird zusaetzlich nach Vorname sortiert")
    void compare_sameLastname_sortsByFirstname() {
        // anna.lastname == annaZweite.lastname == "Anderegg"
        // firstname: "Anna" vs "Zoe" -> Anna zuerst
        assertTrue(comparator.compare(anna, annaZweite) < 0);
        assertTrue(comparator.compare(annaZweite, anna) > 0);
    }

    @Test
    @DisplayName("Identische Adresse ergibt 0")
    void compare_sameAddress_returnsZero() {
        assertEquals(0, comparator.compare(anna, anna));
    }

    @Test
    @DisplayName("Sortieren einer Liste ergibt die erwartete Reihenfolge")
    void sortList_producesExpectedOrder() {
        List<Address> addresses = new ArrayList<>(List.of(bernd, annaZweite, anna));

        addresses.sort(comparator);

        assertEquals("Anna", addresses.get(0).getFirstname());
        assertEquals("Zoe", addresses.get(1).getFirstname());
        assertEquals("Bernd", addresses.get(2).getFirstname());
    }

    @Test
    @DisplayName("null-Nachname wird nicht mit NullPointerException bestraft")
    void compare_nullLastname_doesNotThrow() {
        Address nullLastname = new Address(4, "Chris", null, "076", new Date());

        assertDoesNotThrow(() -> comparator.compare(nullLastname, anna));
        // nullsFirst -> null gilt als "kleiner"
        assertTrue(comparator.compare(nullLastname, anna) < 0);
    }
}
```
### AdressServiceTest
```java
import ch.tbz.m450.repository.Address;
import ch.tbz.m450.repository.AddressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AddressServiceTest {

    @Mock
    private AddressRepository addressRepository;

    private AddressService addressService;

    private Address anna;
    private Address bernd;

    @BeforeEach
    void setUp() {
        addressService = new AddressService(addressRepository);

        anna = new Address(1, "Anna", "Anderegg", "079", new Date());
        bernd = new Address(2, "Bernd", "Berger", "078", new Date());
    }

    @Test
    @DisplayName("save() delegiert direkt an das Repository und gibt dessen Resultat zurueck")
    void save_delegatesToRepository() {
        when(addressRepository.save(anna)).thenReturn(anna);

        Address result = addressService.save(anna);

        assertEquals(anna, result);
        verify(addressRepository, times(1)).save(anna);
    }

    @Test
    @DisplayName("getAll() sortiert die vom Repository gelieferten Adressen mit AddressComparator")
    void getAll_returnsSortedAddresses() {
        // Repository liefert absichtlich unsortiert (Bernd vor Anna)
        when(addressRepository.findAll()).thenReturn(List.of(bernd, anna));

        List<Address> result = addressService.getAll();

        assertEquals(2, result.size());
        assertEquals("Anderegg", result.get(0).getLastname(), "Anderegg muss vor Berger stehen");
        assertEquals("Berger", result.get(1).getLastname());
        verify(addressRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("getAll() gibt eine leere Liste zurueck, wenn das Repository leer ist")
    void getAll_emptyRepository_returnsEmptyList() {
        when(addressRepository.findAll()).thenReturn(List.of());

        List<Address> result = addressService.getAll();

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getAddress() gibt Optional.of(address) zurueck, wenn die ID existiert")
    void getAddress_existingId_returnsOptionalWithAddress() {
        when(addressRepository.findById(1)).thenReturn(Optional.of(anna));

        Optional<Address> result = addressService.getAddress(1);

        assertTrue(result.isPresent());
        assertEquals(anna, result.get());
    }

    @Test
    @DisplayName("getAddress() gibt Optional.empty() zurueck, wenn die ID nicht existiert")
    void getAddress_missingId_returnsEmptyOptional() {
        when(addressRepository.findById(999)).thenReturn(Optional.empty());

        Optional<Address> result = addressService.getAddress(999);

        assertTrue(result.isEmpty());
        verify(addressRepository, times(1)).findById(999);
    }
}

```

###AdressController Test:
```java
import ch.tbz.m450.repository.Address;
import ch.tbz.m450.service.AddressService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AddressControllerTest {

    @Mock
    private AddressService addressService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private Address anna;

    @BeforeEach
    void setUp() {
        AddressController controller = new AddressController(addressService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        anna = new Address(1, "Anna", "Anderegg", "079", new Date());
    }

    @Test
    @DisplayName("POST /address erstellt eine Adresse und gibt Status 201 zurueck")
    void createAddress_returns201AndCreatedAddress() throws Exception {
        when(addressService.save(any(Address.class))).thenReturn(anna);

        mockMvc.perform(post("/address")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(anna)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstname").value("Anna"))
                .andExpect(jsonPath("$.lastname").value("Anderegg"));

        verify(addressService, times(1)).save(any(Address.class));
    }

    @Test
    @DisplayName("GET /address gibt Status 200 und die Liste aller Adressen zurueck")
    void getAddresses_returns200AndList() throws Exception {
        when(addressService.getAll()).thenReturn(List.of(anna));

        mockMvc.perform(get("/address"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(1)))
                .andExpect(jsonPath("$[0].firstname").value("Anna"));

        verify(addressService, times(1)).getAll();
    }

    @Test
    @DisplayName("GET /address/{id} gibt Status 200 zurueck, wenn die Adresse existiert")
    void getAddress_existingId_returns200() throws Exception {
        when(addressService.getAddress(1)).thenReturn(Optional.of(anna));

        mockMvc.perform(get("/address/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstname").value("Anna"));
    }

    @Test
    @DisplayName("GET /address/{id} gibt Status 404 zurueck, wenn die Adresse nicht existiert")
    void getAddress_missingId_returns404() throws Exception {
        when(addressService.getAddress(999)).thenReturn(Optional.empty());

        mockMvc.perform(get("/address/999"))
                .andExpect(status().isNotFound());

        verify(addressService, times(1)).getAddress(999);
    }
}
```

