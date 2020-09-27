import * as game from 'natives';
import * as alt from 'alt-client';
class Rope {
    private _ropeID;
    private _length;

    constructor(ropeId, length) {
        if (!game.ropeAreTexturesLoaded()) {
            game.ropeLoadTextures();
        }
        this._ropeID = ropeId;
        this._length = length;
    }

    /**
     * @returns returns length of rope
     */
    get length() {
        return this._length;
    }

    /**
     * Sets a new length for the Rope
     * @param length new length of rope
     */
    set length(length: number) {
        this._length = length;
        game.ropeForceLength(this._ropeID, length);
    }

    /**
     * @returns Current rope vertex count
     */
    get vertexCount(): number {
        return game.getRopeVertexCount(this._ropeID);
    }

    /**
     * activate physics for current rope
     */
    public activatePhysics = () => {
        game.activatePhysics(this._ropeID);
    };

    /**
     * Attach the rope between two entities at given locations on the entities.
     * @param entityOne The first entity to attach to.
     * @param positionOne Where on the first entity to attach the rope to.
     * @param entityTwo The second entity to attach to.
     * @param positionTwo Where on the second entity to attach the rope to.
     * @param length The desired length of the rope between the two entities.
     */
    public attachEntities = (entityOne: number, positionOne: alt.Vector3, entityTwo: number, positionTwo: alt.Vector3, length: number) => {
        const p10 = false;
        const p11 = false;
        game.attachEntitiesToRope(this._ropeID, entityOne, entityTwo, positionOne.x, positionOne.y, positionOne.z, positionTwo.x, positionTwo.y, positionTwo.z, length, p10, p11, null, null);
    };

    /**
     * Attach the rope between two entities at given locations of bone names
     * @param entityOne The first entity to attach to.
     * @param boneNameOne Bonename of the first entity where the rope should be attach
     * @param entityTwo The second entity to attach to.
     * @param boneNameTwo Bonename of the second entity where the rope should be attach
     * @param length The desired length of the rope between the two entities.
     */
    public attachEntitiesByBoneNames = (entityOne: number, boneNameOne: string, entityTwo: number, boneNameTwo: string, length: number): void => {
        const p10 = false;
        const p11 = false;
        const oneBoneIndex = game.getEntityBoneIndexByName(entityOne, boneNameOne);
        const twoBoneIndex = game.getEntityBoneIndexByName(entityTwo, boneNameTwo);
        if (oneBoneIndex === -1 || twoBoneIndex === -1) {
            return alt.log("Cannot attach Rope to a bone that doesn't exist! boneIndexOne: " + oneBoneIndex + ' boneIndexTwo: ' + twoBoneIndex);
        }
        const positionOne = game.getWorldPositionOfEntityBone(entityOne, oneBoneIndex);
        const positionTwo = game.getWorldPositionOfEntityBone(entityOne, twoBoneIndex);
        game.attachEntitiesToRope(this._ropeID, entityOne, entityTwo, positionOne.x, positionOne.y, positionOne.z, positionTwo.x, positionTwo.y, positionTwo.z, length, p10, p11, null, null);
    };

    /**
     * Attach the rope to an entity.
     * @param entity Entity to attach the rope to.
     * @param position Location where the rope is to be attached.
     */
    public attachEntity = (entity: number, position: alt.Vector3): void => {
        const p5 = false;
        game.attachRopeToEntity(this._ropeID, entity, position.x, position.y, position.z, p5);
    };

    /**
     * Delete the rope from the world. This does not delete the rope object.
     */
    public delete = (): void => {
        game.deleteRope(this._ropeID);
    };

    /**
     * Detach the rope from an entity.
     * @param entity Entity to detach the rope from.
     */
    public detachEntity = (entity: number): void => {
        game.detachRopeFromEntity(this._ropeID, entity);
    };

    /**
     * Check if the rope still exists in the world based on it's id.
     */
    public exists = (): boolean => {
        return game.doesRopeExist(this._ropeID)[0];
    };

    /**
     * Return the world location of a specified vertex on the rope.
     * @param vert Vertex to get location from.
     */
    public getVertexCoord = (vert: number): alt.Vector3 => {
        return game.getRopeVertexCoord(this._ropeID, vert);
    };

    /**
     * Pin a vertex of the rope to a certain location.
     * @param vert Vertex to pin.
     * @param pos Location to pin the vertex to.
     */
    public pinVertex = (vert: number, pos: alt.Vector3): void => {
        game.pinRopeVertex(this._ropeID, vert, pos.x, pos.y, pos.z);
    };

    /**
     * Unpin a specified vertex from it's current pinned location (if any).
     * @param vert Vertex to unpin.
     */
    public unpinVertex = (vert: number): void => {
        game.unpinRopeVertex(this._ropeID, vert);
    };

    /**
     * Resets the length of the rope to it's length upon object creation or a length of 1.
     * @param reset true for reset to original and false to reset length to 1
     */
    public resetLength = (reset: boolean): void => {
        game.ropeResetLength(this._ropeID, reset ? this._length : 1);
    };

    /**
     * Static function to create a ropeObject from a already existing rope
     * @param ropeId id of the already created rope
     */
    public static createFromId = (ropeId: number, length: number): Rope => {
        if (game.doesRopeExist(ropeId)[0]) {
            return new Rope(ropeId, length);
        } else {
            alt.log("Cannot create a rope object when the rope doesn't exists!");
            return null;
        }
    };

    /**
     * wrap the addRope Native function to get a Rope object instead of ropeId
     * @param pos alt.Vector3
     * @param rot alt.Vector3
     * @param length
     * @param ropeType 0 crashes the game 4 and bellow is a thick rope 5 and up are small metal wires
     * @param maxLength
     * @param minLength
     * @param rigid If max length is zero, and this is set to false the rope will become rigid (it will force a specific distance, what ever length is, between the objects).
     * @param breakWhenShot
     */
    public static addRope = (pos: alt.Vector3, rot: alt.Vector3, length: number, ropeType: number, maxLength: number, minLength: number, rigid: boolean, breakWhenShot: boolean): Rope => {
        if (ropeType <= 0) {
            alt.log('Cannot create a rope with ropeType 0 or less because this crash your game!');
            return null;
        }
        const rope = game.addRope(pos.x, pos.y, pos.z, rot.x, rot.y, rot.z, length, ropeType, maxLength, minLength, 0.0, false, false, rigid, 5.0, breakWhenShot, null);
        return new Rope(rope[0], length);
    };

    /**
     * Calualte the rope length from pos1 to pos2
     * @param pos1 position one
     * @param pos2 position two
     */
    public static calcRopeLength = (pos1: alt.Vector3, pos2: alt.Vector3): number => {
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y) + Math.abs(pos1.z - pos2.z);
    };
}
