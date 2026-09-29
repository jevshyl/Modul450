package tbz.project.spaceproject;

import lombok.Getter;

@Getter
public abstract class SpaceObject implements Explorable {

    protected String id;
    protected String name;

    public SpaceObject(String id, String name) {
        this.id = id;
        this.name = name;
    }

    @Override
    public String getInfo() {
        return "SpaceObject: " + name + " (ID: " + id + ")";
    }
}
