package tbz.project.spaceproject;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SpaceObjectTest {

    @Test
    void formatsItsOwnInformation() {
        SpaceObject object = new SpaceObject("sol", "Sun") {
            @Override
            public String explore() {
                return "explore";
            }

            @Override
            public boolean isExplorable() {
                return true;
            }

            @Override
            public String getNotExplorableReason() {
                return "";
            }
        };

        assertThat(object.getInfo()).isEqualTo("SpaceObject: Sun (ID: sol)");
        assertThat(object.getId()).isEqualTo("sol");
        assertThat(object.getName()).isEqualTo("Sun");
    }
}
