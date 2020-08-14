/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.dxos = (function() {

    /**
     * Namespace dxos.
     * @exports dxos
     * @namespace
     */
    var dxos = {};

    dxos.echo = (function() {

        /**
         * Namespace echo.
         * @memberof dxos
         * @namespace
         */
        var echo = {};

        echo.testing = (function() {

            /**
             * Namespace testing.
             * @memberof dxos.echo
             * @namespace
             */
            var testing = {};

            testing.FeedMessage = (function() {

                /**
                 * Properties of a FeedMessage.
                 * @memberof dxos.echo.testing
                 * @interface IFeedMessage
                 * @property {dxos.echo.testing.IFeedGenesis|null} [genesis] FeedMessage genesis
                 * @property {dxos.echo.testing.IHaloEnvelope|null} [halo] FeedMessage halo
                 * @property {dxos.echo.testing.IEchoEnvelope|null} [echo] FeedMessage echo
                 */

                /**
                 * Constructs a new FeedMessage.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents a FeedMessage.
                 * @implements IFeedMessage
                 * @constructor
                 * @param {dxos.echo.testing.IFeedMessage=} [properties] Properties to set
                 */
                function FeedMessage(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * FeedMessage genesis.
                 * @member {dxos.echo.testing.IFeedGenesis|null|undefined} genesis
                 * @memberof dxos.echo.testing.FeedMessage
                 * @instance
                 */
                FeedMessage.prototype.genesis = null;

                /**
                 * FeedMessage halo.
                 * @member {dxos.echo.testing.IHaloEnvelope|null|undefined} halo
                 * @memberof dxos.echo.testing.FeedMessage
                 * @instance
                 */
                FeedMessage.prototype.halo = null;

                /**
                 * FeedMessage echo.
                 * @member {dxos.echo.testing.IEchoEnvelope|null|undefined} echo
                 * @memberof dxos.echo.testing.FeedMessage
                 * @instance
                 */
                FeedMessage.prototype.echo = null;

                /**
                 * Creates a new FeedMessage instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.FeedMessage
                 * @static
                 * @param {dxos.echo.testing.IFeedMessage=} [properties] Properties to set
                 * @returns {dxos.echo.testing.FeedMessage} FeedMessage instance
                 */
                FeedMessage.create = function create(properties) {
                    return new FeedMessage(properties);
                };

                /**
                 * Encodes the specified FeedMessage message. Does not implicitly {@link dxos.echo.testing.FeedMessage.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.FeedMessage
                 * @static
                 * @param {dxos.echo.testing.IFeedMessage} message FeedMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FeedMessage.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.genesis != null && Object.hasOwnProperty.call(message, "genesis"))
                        $root.dxos.echo.testing.FeedGenesis.encode(message.genesis, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.halo != null && Object.hasOwnProperty.call(message, "halo"))
                        $root.dxos.echo.testing.HaloEnvelope.encode(message.halo, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    if (message.echo != null && Object.hasOwnProperty.call(message, "echo"))
                        $root.dxos.echo.testing.EchoEnvelope.encode(message.echo, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified FeedMessage message, length delimited. Does not implicitly {@link dxos.echo.testing.FeedMessage.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.FeedMessage
                 * @static
                 * @param {dxos.echo.testing.IFeedMessage} message FeedMessage message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FeedMessage.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a FeedMessage message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.FeedMessage
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.FeedMessage} FeedMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FeedMessage.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.FeedMessage();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.genesis = $root.dxos.echo.testing.FeedGenesis.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.halo = $root.dxos.echo.testing.HaloEnvelope.decode(reader, reader.uint32());
                            break;
                        case 3:
                            message.echo = $root.dxos.echo.testing.EchoEnvelope.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a FeedMessage message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.FeedMessage
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.FeedMessage} FeedMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FeedMessage.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a FeedMessage message.
                 * @function verify
                 * @memberof dxos.echo.testing.FeedMessage
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                FeedMessage.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.genesis != null && message.hasOwnProperty("genesis")) {
                        var error = $root.dxos.echo.testing.FeedGenesis.verify(message.genesis);
                        if (error)
                            return "genesis." + error;
                    }
                    if (message.halo != null && message.hasOwnProperty("halo")) {
                        var error = $root.dxos.echo.testing.HaloEnvelope.verify(message.halo);
                        if (error)
                            return "halo." + error;
                    }
                    if (message.echo != null && message.hasOwnProperty("echo")) {
                        var error = $root.dxos.echo.testing.EchoEnvelope.verify(message.echo);
                        if (error)
                            return "echo." + error;
                    }
                    return null;
                };

                /**
                 * Creates a FeedMessage message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.FeedMessage
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.FeedMessage} FeedMessage
                 */
                FeedMessage.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.FeedMessage)
                        return object;
                    var message = new $root.dxos.echo.testing.FeedMessage();
                    if (object.genesis != null) {
                        if (typeof object.genesis !== "object")
                            throw TypeError(".dxos.echo.testing.FeedMessage.genesis: object expected");
                        message.genesis = $root.dxos.echo.testing.FeedGenesis.fromObject(object.genesis);
                    }
                    if (object.halo != null) {
                        if (typeof object.halo !== "object")
                            throw TypeError(".dxos.echo.testing.FeedMessage.halo: object expected");
                        message.halo = $root.dxos.echo.testing.HaloEnvelope.fromObject(object.halo);
                    }
                    if (object.echo != null) {
                        if (typeof object.echo !== "object")
                            throw TypeError(".dxos.echo.testing.FeedMessage.echo: object expected");
                        message.echo = $root.dxos.echo.testing.EchoEnvelope.fromObject(object.echo);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a FeedMessage message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.FeedMessage
                 * @static
                 * @param {dxos.echo.testing.FeedMessage} message FeedMessage
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                FeedMessage.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.genesis = null;
                        object.halo = null;
                        object.echo = null;
                    }
                    if (message.genesis != null && message.hasOwnProperty("genesis"))
                        object.genesis = $root.dxos.echo.testing.FeedGenesis.toObject(message.genesis, options);
                    if (message.halo != null && message.hasOwnProperty("halo"))
                        object.halo = $root.dxos.echo.testing.HaloEnvelope.toObject(message.halo, options);
                    if (message.echo != null && message.hasOwnProperty("echo"))
                        object.echo = $root.dxos.echo.testing.EchoEnvelope.toObject(message.echo, options);
                    return object;
                };

                /**
                 * Converts this FeedMessage to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.FeedMessage
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                FeedMessage.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return FeedMessage;
            })();

            testing.FeedGenesis = (function() {

                /**
                 * Properties of a FeedGenesis.
                 * @memberof dxos.echo.testing
                 * @interface IFeedGenesis
                 * @property {dxos.echo.testing.IPartyGenesis|null} [partyGenesis] FeedGenesis partyGenesis
                 */

                /**
                 * Constructs a new FeedGenesis.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents a FeedGenesis.
                 * @implements IFeedGenesis
                 * @constructor
                 * @param {dxos.echo.testing.IFeedGenesis=} [properties] Properties to set
                 */
                function FeedGenesis(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * FeedGenesis partyGenesis.
                 * @member {dxos.echo.testing.IPartyGenesis|null|undefined} partyGenesis
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @instance
                 */
                FeedGenesis.prototype.partyGenesis = null;

                /**
                 * Creates a new FeedGenesis instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @static
                 * @param {dxos.echo.testing.IFeedGenesis=} [properties] Properties to set
                 * @returns {dxos.echo.testing.FeedGenesis} FeedGenesis instance
                 */
                FeedGenesis.create = function create(properties) {
                    return new FeedGenesis(properties);
                };

                /**
                 * Encodes the specified FeedGenesis message. Does not implicitly {@link dxos.echo.testing.FeedGenesis.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @static
                 * @param {dxos.echo.testing.IFeedGenesis} message FeedGenesis message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FeedGenesis.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.partyGenesis != null && Object.hasOwnProperty.call(message, "partyGenesis"))
                        $root.dxos.echo.testing.PartyGenesis.encode(message.partyGenesis, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified FeedGenesis message, length delimited. Does not implicitly {@link dxos.echo.testing.FeedGenesis.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @static
                 * @param {dxos.echo.testing.IFeedGenesis} message FeedGenesis message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                FeedGenesis.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a FeedGenesis message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.FeedGenesis} FeedGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FeedGenesis.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.FeedGenesis();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.partyGenesis = $root.dxos.echo.testing.PartyGenesis.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a FeedGenesis message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.FeedGenesis} FeedGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                FeedGenesis.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a FeedGenesis message.
                 * @function verify
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                FeedGenesis.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.partyGenesis != null && message.hasOwnProperty("partyGenesis")) {
                        var error = $root.dxos.echo.testing.PartyGenesis.verify(message.partyGenesis);
                        if (error)
                            return "partyGenesis." + error;
                    }
                    return null;
                };

                /**
                 * Creates a FeedGenesis message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.FeedGenesis} FeedGenesis
                 */
                FeedGenesis.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.FeedGenesis)
                        return object;
                    var message = new $root.dxos.echo.testing.FeedGenesis();
                    if (object.partyGenesis != null) {
                        if (typeof object.partyGenesis !== "object")
                            throw TypeError(".dxos.echo.testing.FeedGenesis.partyGenesis: object expected");
                        message.partyGenesis = $root.dxos.echo.testing.PartyGenesis.fromObject(object.partyGenesis);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a FeedGenesis message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @static
                 * @param {dxos.echo.testing.FeedGenesis} message FeedGenesis
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                FeedGenesis.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.partyGenesis = null;
                    if (message.partyGenesis != null && message.hasOwnProperty("partyGenesis"))
                        object.partyGenesis = $root.dxos.echo.testing.PartyGenesis.toObject(message.partyGenesis, options);
                    return object;
                };

                /**
                 * Converts this FeedGenesis to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.FeedGenesis
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                FeedGenesis.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return FeedGenesis;
            })();

            testing.HaloEnvelope = (function() {

                /**
                 * Properties of a HaloEnvelope.
                 * @memberof dxos.echo.testing
                 * @interface IHaloEnvelope
                 * @property {dxos.echo.testing.IPartyAdmit|null} [admit] HaloEnvelope admit
                 * @property {dxos.echo.testing.IPartyEject|null} [eject] HaloEnvelope eject
                 */

                /**
                 * Constructs a new HaloEnvelope.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents a HaloEnvelope.
                 * @implements IHaloEnvelope
                 * @constructor
                 * @param {dxos.echo.testing.IHaloEnvelope=} [properties] Properties to set
                 */
                function HaloEnvelope(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * HaloEnvelope admit.
                 * @member {dxos.echo.testing.IPartyAdmit|null|undefined} admit
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @instance
                 */
                HaloEnvelope.prototype.admit = null;

                /**
                 * HaloEnvelope eject.
                 * @member {dxos.echo.testing.IPartyEject|null|undefined} eject
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @instance
                 */
                HaloEnvelope.prototype.eject = null;

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

                /**
                 * HaloEnvelope action.
                 * @member {"admit"|"eject"|undefined} action
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @instance
                 */
                Object.defineProperty(HaloEnvelope.prototype, "action", {
                    get: $util.oneOfGetter($oneOfFields = ["admit", "eject"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new HaloEnvelope instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @static
                 * @param {dxos.echo.testing.IHaloEnvelope=} [properties] Properties to set
                 * @returns {dxos.echo.testing.HaloEnvelope} HaloEnvelope instance
                 */
                HaloEnvelope.create = function create(properties) {
                    return new HaloEnvelope(properties);
                };

                /**
                 * Encodes the specified HaloEnvelope message. Does not implicitly {@link dxos.echo.testing.HaloEnvelope.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @static
                 * @param {dxos.echo.testing.IHaloEnvelope} message HaloEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HaloEnvelope.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.admit != null && Object.hasOwnProperty.call(message, "admit"))
                        $root.dxos.echo.testing.PartyAdmit.encode(message.admit, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.eject != null && Object.hasOwnProperty.call(message, "eject"))
                        $root.dxos.echo.testing.PartyEject.encode(message.eject, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified HaloEnvelope message, length delimited. Does not implicitly {@link dxos.echo.testing.HaloEnvelope.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @static
                 * @param {dxos.echo.testing.IHaloEnvelope} message HaloEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                HaloEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a HaloEnvelope message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.HaloEnvelope} HaloEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HaloEnvelope.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.HaloEnvelope();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.admit = $root.dxos.echo.testing.PartyAdmit.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.eject = $root.dxos.echo.testing.PartyEject.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a HaloEnvelope message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.HaloEnvelope} HaloEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                HaloEnvelope.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a HaloEnvelope message.
                 * @function verify
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                HaloEnvelope.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    var properties = {};
                    if (message.admit != null && message.hasOwnProperty("admit")) {
                        properties.action = 1;
                        {
                            var error = $root.dxos.echo.testing.PartyAdmit.verify(message.admit);
                            if (error)
                                return "admit." + error;
                        }
                    }
                    if (message.eject != null && message.hasOwnProperty("eject")) {
                        if (properties.action === 1)
                            return "action: multiple values";
                        properties.action = 1;
                        {
                            var error = $root.dxos.echo.testing.PartyEject.verify(message.eject);
                            if (error)
                                return "eject." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a HaloEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.HaloEnvelope} HaloEnvelope
                 */
                HaloEnvelope.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.HaloEnvelope)
                        return object;
                    var message = new $root.dxos.echo.testing.HaloEnvelope();
                    if (object.admit != null) {
                        if (typeof object.admit !== "object")
                            throw TypeError(".dxos.echo.testing.HaloEnvelope.admit: object expected");
                        message.admit = $root.dxos.echo.testing.PartyAdmit.fromObject(object.admit);
                    }
                    if (object.eject != null) {
                        if (typeof object.eject !== "object")
                            throw TypeError(".dxos.echo.testing.HaloEnvelope.eject: object expected");
                        message.eject = $root.dxos.echo.testing.PartyEject.fromObject(object.eject);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a HaloEnvelope message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @static
                 * @param {dxos.echo.testing.HaloEnvelope} message HaloEnvelope
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                HaloEnvelope.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (message.admit != null && message.hasOwnProperty("admit")) {
                        object.admit = $root.dxos.echo.testing.PartyAdmit.toObject(message.admit, options);
                        if (options.oneofs)
                            object.action = "admit";
                    }
                    if (message.eject != null && message.hasOwnProperty("eject")) {
                        object.eject = $root.dxos.echo.testing.PartyEject.toObject(message.eject, options);
                        if (options.oneofs)
                            object.action = "eject";
                    }
                    return object;
                };

                /**
                 * Converts this HaloEnvelope to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.HaloEnvelope
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                HaloEnvelope.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return HaloEnvelope;
            })();

            testing.PartyGenesis = (function() {

                /**
                 * Properties of a PartyGenesis.
                 * @memberof dxos.echo.testing
                 * @interface IPartyGenesis
                 * @property {Uint8Array|null} [feedKey] PartyGenesis feedKey
                 */

                /**
                 * Constructs a new PartyGenesis.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents a PartyGenesis.
                 * @implements IPartyGenesis
                 * @constructor
                 * @param {dxos.echo.testing.IPartyGenesis=} [properties] Properties to set
                 */
                function PartyGenesis(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * PartyGenesis feedKey.
                 * @member {Uint8Array} feedKey
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @instance
                 */
                PartyGenesis.prototype.feedKey = $util.newBuffer([]);

                /**
                 * Creates a new PartyGenesis instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @static
                 * @param {dxos.echo.testing.IPartyGenesis=} [properties] Properties to set
                 * @returns {dxos.echo.testing.PartyGenesis} PartyGenesis instance
                 */
                PartyGenesis.create = function create(properties) {
                    return new PartyGenesis(properties);
                };

                /**
                 * Encodes the specified PartyGenesis message. Does not implicitly {@link dxos.echo.testing.PartyGenesis.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @static
                 * @param {dxos.echo.testing.IPartyGenesis} message PartyGenesis message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PartyGenesis.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.feedKey != null && Object.hasOwnProperty.call(message, "feedKey"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.feedKey);
                    return writer;
                };

                /**
                 * Encodes the specified PartyGenesis message, length delimited. Does not implicitly {@link dxos.echo.testing.PartyGenesis.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @static
                 * @param {dxos.echo.testing.IPartyGenesis} message PartyGenesis message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PartyGenesis.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a PartyGenesis message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.PartyGenesis} PartyGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PartyGenesis.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.PartyGenesis();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.feedKey = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a PartyGenesis message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.PartyGenesis} PartyGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PartyGenesis.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a PartyGenesis message.
                 * @function verify
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                PartyGenesis.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.feedKey != null && message.hasOwnProperty("feedKey"))
                        if (!(message.feedKey && typeof message.feedKey.length === "number" || $util.isString(message.feedKey)))
                            return "feedKey: buffer expected";
                    return null;
                };

                /**
                 * Creates a PartyGenesis message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.PartyGenesis} PartyGenesis
                 */
                PartyGenesis.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.PartyGenesis)
                        return object;
                    var message = new $root.dxos.echo.testing.PartyGenesis();
                    if (object.feedKey != null)
                        if (typeof object.feedKey === "string")
                            $util.base64.decode(object.feedKey, message.feedKey = $util.newBuffer($util.base64.length(object.feedKey)), 0);
                        else if (object.feedKey.length)
                            message.feedKey = object.feedKey;
                    return message;
                };

                /**
                 * Creates a plain object from a PartyGenesis message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @static
                 * @param {dxos.echo.testing.PartyGenesis} message PartyGenesis
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                PartyGenesis.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.feedKey = "";
                        else {
                            object.feedKey = [];
                            if (options.bytes !== Array)
                                object.feedKey = $util.newBuffer(object.feedKey);
                        }
                    if (message.feedKey != null && message.hasOwnProperty("feedKey"))
                        object.feedKey = options.bytes === String ? $util.base64.encode(message.feedKey, 0, message.feedKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.feedKey) : message.feedKey;
                    return object;
                };

                /**
                 * Converts this PartyGenesis to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.PartyGenesis
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                PartyGenesis.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return PartyGenesis;
            })();

            testing.PartyAdmit = (function() {

                /**
                 * Properties of a PartyAdmit.
                 * @memberof dxos.echo.testing
                 * @interface IPartyAdmit
                 * @property {Uint8Array|null} [feedKey] PartyAdmit feedKey
                 */

                /**
                 * Constructs a new PartyAdmit.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents a PartyAdmit.
                 * @implements IPartyAdmit
                 * @constructor
                 * @param {dxos.echo.testing.IPartyAdmit=} [properties] Properties to set
                 */
                function PartyAdmit(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * PartyAdmit feedKey.
                 * @member {Uint8Array} feedKey
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @instance
                 */
                PartyAdmit.prototype.feedKey = $util.newBuffer([]);

                /**
                 * Creates a new PartyAdmit instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @static
                 * @param {dxos.echo.testing.IPartyAdmit=} [properties] Properties to set
                 * @returns {dxos.echo.testing.PartyAdmit} PartyAdmit instance
                 */
                PartyAdmit.create = function create(properties) {
                    return new PartyAdmit(properties);
                };

                /**
                 * Encodes the specified PartyAdmit message. Does not implicitly {@link dxos.echo.testing.PartyAdmit.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @static
                 * @param {dxos.echo.testing.IPartyAdmit} message PartyAdmit message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PartyAdmit.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.feedKey != null && Object.hasOwnProperty.call(message, "feedKey"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.feedKey);
                    return writer;
                };

                /**
                 * Encodes the specified PartyAdmit message, length delimited. Does not implicitly {@link dxos.echo.testing.PartyAdmit.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @static
                 * @param {dxos.echo.testing.IPartyAdmit} message PartyAdmit message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PartyAdmit.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a PartyAdmit message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.PartyAdmit} PartyAdmit
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PartyAdmit.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.PartyAdmit();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.feedKey = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a PartyAdmit message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.PartyAdmit} PartyAdmit
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PartyAdmit.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a PartyAdmit message.
                 * @function verify
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                PartyAdmit.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.feedKey != null && message.hasOwnProperty("feedKey"))
                        if (!(message.feedKey && typeof message.feedKey.length === "number" || $util.isString(message.feedKey)))
                            return "feedKey: buffer expected";
                    return null;
                };

                /**
                 * Creates a PartyAdmit message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.PartyAdmit} PartyAdmit
                 */
                PartyAdmit.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.PartyAdmit)
                        return object;
                    var message = new $root.dxos.echo.testing.PartyAdmit();
                    if (object.feedKey != null)
                        if (typeof object.feedKey === "string")
                            $util.base64.decode(object.feedKey, message.feedKey = $util.newBuffer($util.base64.length(object.feedKey)), 0);
                        else if (object.feedKey.length)
                            message.feedKey = object.feedKey;
                    return message;
                };

                /**
                 * Creates a plain object from a PartyAdmit message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @static
                 * @param {dxos.echo.testing.PartyAdmit} message PartyAdmit
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                PartyAdmit.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.feedKey = "";
                        else {
                            object.feedKey = [];
                            if (options.bytes !== Array)
                                object.feedKey = $util.newBuffer(object.feedKey);
                        }
                    if (message.feedKey != null && message.hasOwnProperty("feedKey"))
                        object.feedKey = options.bytes === String ? $util.base64.encode(message.feedKey, 0, message.feedKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.feedKey) : message.feedKey;
                    return object;
                };

                /**
                 * Converts this PartyAdmit to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.PartyAdmit
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                PartyAdmit.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return PartyAdmit;
            })();

            testing.PartyEject = (function() {

                /**
                 * Properties of a PartyEject.
                 * @memberof dxos.echo.testing
                 * @interface IPartyEject
                 * @property {Uint8Array|null} [feedKey] PartyEject feedKey
                 */

                /**
                 * Constructs a new PartyEject.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents a PartyEject.
                 * @implements IPartyEject
                 * @constructor
                 * @param {dxos.echo.testing.IPartyEject=} [properties] Properties to set
                 */
                function PartyEject(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * PartyEject feedKey.
                 * @member {Uint8Array} feedKey
                 * @memberof dxos.echo.testing.PartyEject
                 * @instance
                 */
                PartyEject.prototype.feedKey = $util.newBuffer([]);

                /**
                 * Creates a new PartyEject instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.PartyEject
                 * @static
                 * @param {dxos.echo.testing.IPartyEject=} [properties] Properties to set
                 * @returns {dxos.echo.testing.PartyEject} PartyEject instance
                 */
                PartyEject.create = function create(properties) {
                    return new PartyEject(properties);
                };

                /**
                 * Encodes the specified PartyEject message. Does not implicitly {@link dxos.echo.testing.PartyEject.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.PartyEject
                 * @static
                 * @param {dxos.echo.testing.IPartyEject} message PartyEject message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PartyEject.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.feedKey != null && Object.hasOwnProperty.call(message, "feedKey"))
                        writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.feedKey);
                    return writer;
                };

                /**
                 * Encodes the specified PartyEject message, length delimited. Does not implicitly {@link dxos.echo.testing.PartyEject.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.PartyEject
                 * @static
                 * @param {dxos.echo.testing.IPartyEject} message PartyEject message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                PartyEject.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a PartyEject message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.PartyEject
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.PartyEject} PartyEject
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PartyEject.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.PartyEject();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.feedKey = reader.bytes();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a PartyEject message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.PartyEject
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.PartyEject} PartyEject
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                PartyEject.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a PartyEject message.
                 * @function verify
                 * @memberof dxos.echo.testing.PartyEject
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                PartyEject.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.feedKey != null && message.hasOwnProperty("feedKey"))
                        if (!(message.feedKey && typeof message.feedKey.length === "number" || $util.isString(message.feedKey)))
                            return "feedKey: buffer expected";
                    return null;
                };

                /**
                 * Creates a PartyEject message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.PartyEject
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.PartyEject} PartyEject
                 */
                PartyEject.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.PartyEject)
                        return object;
                    var message = new $root.dxos.echo.testing.PartyEject();
                    if (object.feedKey != null)
                        if (typeof object.feedKey === "string")
                            $util.base64.decode(object.feedKey, message.feedKey = $util.newBuffer($util.base64.length(object.feedKey)), 0);
                        else if (object.feedKey.length)
                            message.feedKey = object.feedKey;
                    return message;
                };

                /**
                 * Creates a plain object from a PartyEject message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.PartyEject
                 * @static
                 * @param {dxos.echo.testing.PartyEject} message PartyEject
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                PartyEject.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        if (options.bytes === String)
                            object.feedKey = "";
                        else {
                            object.feedKey = [];
                            if (options.bytes !== Array)
                                object.feedKey = $util.newBuffer(object.feedKey);
                        }
                    if (message.feedKey != null && message.hasOwnProperty("feedKey"))
                        object.feedKey = options.bytes === String ? $util.base64.encode(message.feedKey, 0, message.feedKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.feedKey) : message.feedKey;
                    return object;
                };

                /**
                 * Converts this PartyEject to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.PartyEject
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                PartyEject.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return PartyEject;
            })();

            testing.EchoEnvelope = (function() {

                /**
                 * Properties of an EchoEnvelope.
                 * @memberof dxos.echo.testing
                 * @interface IEchoEnvelope
                 * @property {dxos.echo.testing.IVectorTimestamp|null} [timestamp] EchoEnvelope timestamp
                 * @property {string|null} [itemId] EchoEnvelope itemId
                 * @property {dxos.echo.testing.IItemGenesis|null} [genesis] EchoEnvelope genesis
                 * @property {dxos.echo.testing.IItemMutation|null} [itemMutation] EchoEnvelope itemMutation
                 * @property {google.protobuf.IAny|null} [dataMutation] EchoEnvelope dataMutation
                 */

                /**
                 * Constructs a new EchoEnvelope.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents an EchoEnvelope.
                 * @implements IEchoEnvelope
                 * @constructor
                 * @param {dxos.echo.testing.IEchoEnvelope=} [properties] Properties to set
                 */
                function EchoEnvelope(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * EchoEnvelope timestamp.
                 * @member {dxos.echo.testing.IVectorTimestamp|null|undefined} timestamp
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @instance
                 */
                EchoEnvelope.prototype.timestamp = null;

                /**
                 * EchoEnvelope itemId.
                 * @member {string} itemId
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @instance
                 */
                EchoEnvelope.prototype.itemId = "";

                /**
                 * EchoEnvelope genesis.
                 * @member {dxos.echo.testing.IItemGenesis|null|undefined} genesis
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @instance
                 */
                EchoEnvelope.prototype.genesis = null;

                /**
                 * EchoEnvelope itemMutation.
                 * @member {dxos.echo.testing.IItemMutation|null|undefined} itemMutation
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @instance
                 */
                EchoEnvelope.prototype.itemMutation = null;

                /**
                 * EchoEnvelope dataMutation.
                 * @member {google.protobuf.IAny|null|undefined} dataMutation
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @instance
                 */
                EchoEnvelope.prototype.dataMutation = null;

                // OneOf field names bound to virtual getters and setters
                var $oneOfFields;

                /**
                 * EchoEnvelope action.
                 * @member {"genesis"|"itemMutation"|"dataMutation"|undefined} action
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @instance
                 */
                Object.defineProperty(EchoEnvelope.prototype, "action", {
                    get: $util.oneOfGetter($oneOfFields = ["genesis", "itemMutation", "dataMutation"]),
                    set: $util.oneOfSetter($oneOfFields)
                });

                /**
                 * Creates a new EchoEnvelope instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @static
                 * @param {dxos.echo.testing.IEchoEnvelope=} [properties] Properties to set
                 * @returns {dxos.echo.testing.EchoEnvelope} EchoEnvelope instance
                 */
                EchoEnvelope.create = function create(properties) {
                    return new EchoEnvelope(properties);
                };

                /**
                 * Encodes the specified EchoEnvelope message. Does not implicitly {@link dxos.echo.testing.EchoEnvelope.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @static
                 * @param {dxos.echo.testing.IEchoEnvelope} message EchoEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EchoEnvelope.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                        $root.dxos.echo.testing.VectorTimestamp.encode(message.timestamp, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.itemId != null && Object.hasOwnProperty.call(message, "itemId"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.itemId);
                    if (message.genesis != null && Object.hasOwnProperty.call(message, "genesis"))
                        $root.dxos.echo.testing.ItemGenesis.encode(message.genesis, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
                    if (message.itemMutation != null && Object.hasOwnProperty.call(message, "itemMutation"))
                        $root.dxos.echo.testing.ItemMutation.encode(message.itemMutation, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
                    if (message.dataMutation != null && Object.hasOwnProperty.call(message, "dataMutation"))
                        $root.google.protobuf.Any.encode(message.dataMutation, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified EchoEnvelope message, length delimited. Does not implicitly {@link dxos.echo.testing.EchoEnvelope.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @static
                 * @param {dxos.echo.testing.IEchoEnvelope} message EchoEnvelope message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                EchoEnvelope.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an EchoEnvelope message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.EchoEnvelope} EchoEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EchoEnvelope.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.EchoEnvelope();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.timestamp = $root.dxos.echo.testing.VectorTimestamp.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.itemId = reader.string();
                            break;
                        case 10:
                            message.genesis = $root.dxos.echo.testing.ItemGenesis.decode(reader, reader.uint32());
                            break;
                        case 11:
                            message.itemMutation = $root.dxos.echo.testing.ItemMutation.decode(reader, reader.uint32());
                            break;
                        case 12:
                            message.dataMutation = $root.google.protobuf.Any.decode(reader, reader.uint32());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an EchoEnvelope message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.EchoEnvelope} EchoEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                EchoEnvelope.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an EchoEnvelope message.
                 * @function verify
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                EchoEnvelope.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    var properties = {};
                    if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
                        var error = $root.dxos.echo.testing.VectorTimestamp.verify(message.timestamp);
                        if (error)
                            return "timestamp." + error;
                    }
                    if (message.itemId != null && message.hasOwnProperty("itemId"))
                        if (!$util.isString(message.itemId))
                            return "itemId: string expected";
                    if (message.genesis != null && message.hasOwnProperty("genesis")) {
                        properties.action = 1;
                        {
                            var error = $root.dxos.echo.testing.ItemGenesis.verify(message.genesis);
                            if (error)
                                return "genesis." + error;
                        }
                    }
                    if (message.itemMutation != null && message.hasOwnProperty("itemMutation")) {
                        if (properties.action === 1)
                            return "action: multiple values";
                        properties.action = 1;
                        {
                            var error = $root.dxos.echo.testing.ItemMutation.verify(message.itemMutation);
                            if (error)
                                return "itemMutation." + error;
                        }
                    }
                    if (message.dataMutation != null && message.hasOwnProperty("dataMutation")) {
                        if (properties.action === 1)
                            return "action: multiple values";
                        properties.action = 1;
                        {
                            var error = $root.google.protobuf.Any.verify(message.dataMutation);
                            if (error)
                                return "dataMutation." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates an EchoEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.EchoEnvelope} EchoEnvelope
                 */
                EchoEnvelope.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.EchoEnvelope)
                        return object;
                    var message = new $root.dxos.echo.testing.EchoEnvelope();
                    if (object.timestamp != null) {
                        if (typeof object.timestamp !== "object")
                            throw TypeError(".dxos.echo.testing.EchoEnvelope.timestamp: object expected");
                        message.timestamp = $root.dxos.echo.testing.VectorTimestamp.fromObject(object.timestamp);
                    }
                    if (object.itemId != null)
                        message.itemId = String(object.itemId);
                    if (object.genesis != null) {
                        if (typeof object.genesis !== "object")
                            throw TypeError(".dxos.echo.testing.EchoEnvelope.genesis: object expected");
                        message.genesis = $root.dxos.echo.testing.ItemGenesis.fromObject(object.genesis);
                    }
                    if (object.itemMutation != null) {
                        if (typeof object.itemMutation !== "object")
                            throw TypeError(".dxos.echo.testing.EchoEnvelope.itemMutation: object expected");
                        message.itemMutation = $root.dxos.echo.testing.ItemMutation.fromObject(object.itemMutation);
                    }
                    if (object.dataMutation != null) {
                        if (typeof object.dataMutation !== "object")
                            throw TypeError(".dxos.echo.testing.EchoEnvelope.dataMutation: object expected");
                        message.dataMutation = $root.google.protobuf.Any.fromObject(object.dataMutation);
                    }
                    return message;
                };

                /**
                 * Creates a plain object from an EchoEnvelope message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @static
                 * @param {dxos.echo.testing.EchoEnvelope} message EchoEnvelope
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                EchoEnvelope.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.timestamp = null;
                        object.itemId = "";
                    }
                    if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                        object.timestamp = $root.dxos.echo.testing.VectorTimestamp.toObject(message.timestamp, options);
                    if (message.itemId != null && message.hasOwnProperty("itemId"))
                        object.itemId = message.itemId;
                    if (message.genesis != null && message.hasOwnProperty("genesis")) {
                        object.genesis = $root.dxos.echo.testing.ItemGenesis.toObject(message.genesis, options);
                        if (options.oneofs)
                            object.action = "genesis";
                    }
                    if (message.itemMutation != null && message.hasOwnProperty("itemMutation")) {
                        object.itemMutation = $root.dxos.echo.testing.ItemMutation.toObject(message.itemMutation, options);
                        if (options.oneofs)
                            object.action = "itemMutation";
                    }
                    if (message.dataMutation != null && message.hasOwnProperty("dataMutation")) {
                        object.dataMutation = $root.google.protobuf.Any.toObject(message.dataMutation, options);
                        if (options.oneofs)
                            object.action = "dataMutation";
                    }
                    return object;
                };

                /**
                 * Converts this EchoEnvelope to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.EchoEnvelope
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                EchoEnvelope.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return EchoEnvelope;
            })();

            testing.ItemGenesis = (function() {

                /**
                 * Properties of an ItemGenesis.
                 * @memberof dxos.echo.testing
                 * @interface IItemGenesis
                 * @property {string|null} [itemType] ItemGenesis itemType
                 * @property {string|null} [modelType] ItemGenesis modelType
                 * @property {string|null} [modelVersion] ItemGenesis modelVersion
                 */

                /**
                 * Constructs a new ItemGenesis.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents an ItemGenesis.
                 * @implements IItemGenesis
                 * @constructor
                 * @param {dxos.echo.testing.IItemGenesis=} [properties] Properties to set
                 */
                function ItemGenesis(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ItemGenesis itemType.
                 * @member {string} itemType
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @instance
                 */
                ItemGenesis.prototype.itemType = "";

                /**
                 * ItemGenesis modelType.
                 * @member {string} modelType
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @instance
                 */
                ItemGenesis.prototype.modelType = "";

                /**
                 * ItemGenesis modelVersion.
                 * @member {string} modelVersion
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @instance
                 */
                ItemGenesis.prototype.modelVersion = "";

                /**
                 * Creates a new ItemGenesis instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @static
                 * @param {dxos.echo.testing.IItemGenesis=} [properties] Properties to set
                 * @returns {dxos.echo.testing.ItemGenesis} ItemGenesis instance
                 */
                ItemGenesis.create = function create(properties) {
                    return new ItemGenesis(properties);
                };

                /**
                 * Encodes the specified ItemGenesis message. Does not implicitly {@link dxos.echo.testing.ItemGenesis.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @static
                 * @param {dxos.echo.testing.IItemGenesis} message ItemGenesis message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ItemGenesis.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.itemType != null && Object.hasOwnProperty.call(message, "itemType"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.itemType);
                    if (message.modelType != null && Object.hasOwnProperty.call(message, "modelType"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.modelType);
                    if (message.modelVersion != null && Object.hasOwnProperty.call(message, "modelVersion"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.modelVersion);
                    return writer;
                };

                /**
                 * Encodes the specified ItemGenesis message, length delimited. Does not implicitly {@link dxos.echo.testing.ItemGenesis.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @static
                 * @param {dxos.echo.testing.IItemGenesis} message ItemGenesis message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ItemGenesis.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ItemGenesis message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.ItemGenesis} ItemGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ItemGenesis.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.ItemGenesis();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.itemType = reader.string();
                            break;
                        case 2:
                            message.modelType = reader.string();
                            break;
                        case 3:
                            message.modelVersion = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an ItemGenesis message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.ItemGenesis} ItemGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ItemGenesis.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ItemGenesis message.
                 * @function verify
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ItemGenesis.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.itemType != null && message.hasOwnProperty("itemType"))
                        if (!$util.isString(message.itemType))
                            return "itemType: string expected";
                    if (message.modelType != null && message.hasOwnProperty("modelType"))
                        if (!$util.isString(message.modelType))
                            return "modelType: string expected";
                    if (message.modelVersion != null && message.hasOwnProperty("modelVersion"))
                        if (!$util.isString(message.modelVersion))
                            return "modelVersion: string expected";
                    return null;
                };

                /**
                 * Creates an ItemGenesis message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.ItemGenesis} ItemGenesis
                 */
                ItemGenesis.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.ItemGenesis)
                        return object;
                    var message = new $root.dxos.echo.testing.ItemGenesis();
                    if (object.itemType != null)
                        message.itemType = String(object.itemType);
                    if (object.modelType != null)
                        message.modelType = String(object.modelType);
                    if (object.modelVersion != null)
                        message.modelVersion = String(object.modelVersion);
                    return message;
                };

                /**
                 * Creates a plain object from an ItemGenesis message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @static
                 * @param {dxos.echo.testing.ItemGenesis} message ItemGenesis
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ItemGenesis.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.itemType = "";
                        object.modelType = "";
                        object.modelVersion = "";
                    }
                    if (message.itemType != null && message.hasOwnProperty("itemType"))
                        object.itemType = message.itemType;
                    if (message.modelType != null && message.hasOwnProperty("modelType"))
                        object.modelType = message.modelType;
                    if (message.modelVersion != null && message.hasOwnProperty("modelVersion"))
                        object.modelVersion = message.modelVersion;
                    return object;
                };

                /**
                 * Converts this ItemGenesis to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.ItemGenesis
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ItemGenesis.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ItemGenesis;
            })();

            testing.ItemMutation = (function() {

                /**
                 * Properties of an ItemMutation.
                 * @memberof dxos.echo.testing
                 * @interface IItemMutation
                 * @property {string|null} [key] ItemMutation key
                 * @property {string|null} [value] ItemMutation value
                 */

                /**
                 * Constructs a new ItemMutation.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents an ItemMutation.
                 * @implements IItemMutation
                 * @constructor
                 * @param {dxos.echo.testing.IItemMutation=} [properties] Properties to set
                 */
                function ItemMutation(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * ItemMutation key.
                 * @member {string} key
                 * @memberof dxos.echo.testing.ItemMutation
                 * @instance
                 */
                ItemMutation.prototype.key = "";

                /**
                 * ItemMutation value.
                 * @member {string} value
                 * @memberof dxos.echo.testing.ItemMutation
                 * @instance
                 */
                ItemMutation.prototype.value = "";

                /**
                 * Creates a new ItemMutation instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.ItemMutation
                 * @static
                 * @param {dxos.echo.testing.IItemMutation=} [properties] Properties to set
                 * @returns {dxos.echo.testing.ItemMutation} ItemMutation instance
                 */
                ItemMutation.create = function create(properties) {
                    return new ItemMutation(properties);
                };

                /**
                 * Encodes the specified ItemMutation message. Does not implicitly {@link dxos.echo.testing.ItemMutation.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.ItemMutation
                 * @static
                 * @param {dxos.echo.testing.IItemMutation} message ItemMutation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ItemMutation.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.key != null && Object.hasOwnProperty.call(message, "key"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.key);
                    if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.value);
                    return writer;
                };

                /**
                 * Encodes the specified ItemMutation message, length delimited. Does not implicitly {@link dxos.echo.testing.ItemMutation.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.ItemMutation
                 * @static
                 * @param {dxos.echo.testing.IItemMutation} message ItemMutation message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                ItemMutation.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes an ItemMutation message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.ItemMutation
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.ItemMutation} ItemMutation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ItemMutation.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.ItemMutation();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.key = reader.string();
                            break;
                        case 2:
                            message.value = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes an ItemMutation message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.ItemMutation
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.ItemMutation} ItemMutation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                ItemMutation.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies an ItemMutation message.
                 * @function verify
                 * @memberof dxos.echo.testing.ItemMutation
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                ItemMutation.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.key != null && message.hasOwnProperty("key"))
                        if (!$util.isString(message.key))
                            return "key: string expected";
                    if (message.value != null && message.hasOwnProperty("value"))
                        if (!$util.isString(message.value))
                            return "value: string expected";
                    return null;
                };

                /**
                 * Creates an ItemMutation message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.ItemMutation
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.ItemMutation} ItemMutation
                 */
                ItemMutation.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.ItemMutation)
                        return object;
                    var message = new $root.dxos.echo.testing.ItemMutation();
                    if (object.key != null)
                        message.key = String(object.key);
                    if (object.value != null)
                        message.value = String(object.value);
                    return message;
                };

                /**
                 * Creates a plain object from an ItemMutation message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.ItemMutation
                 * @static
                 * @param {dxos.echo.testing.ItemMutation} message ItemMutation
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                ItemMutation.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.key = "";
                        object.value = "";
                    }
                    if (message.key != null && message.hasOwnProperty("key"))
                        object.key = message.key;
                    if (message.value != null && message.hasOwnProperty("value"))
                        object.value = message.value;
                    return object;
                };

                /**
                 * Converts this ItemMutation to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.ItemMutation
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                ItemMutation.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return ItemMutation;
            })();

            testing.VectorTimestamp = (function() {

                /**
                 * Properties of a VectorTimestamp.
                 * @memberof dxos.echo.testing
                 * @interface IVectorTimestamp
                 * @property {Array.<dxos.echo.testing.VectorTimestamp.IPart>|null} [timestamp] VectorTimestamp timestamp
                 */

                /**
                 * Constructs a new VectorTimestamp.
                 * @memberof dxos.echo.testing
                 * @classdesc Represents a VectorTimestamp.
                 * @implements IVectorTimestamp
                 * @constructor
                 * @param {dxos.echo.testing.IVectorTimestamp=} [properties] Properties to set
                 */
                function VectorTimestamp(properties) {
                    this.timestamp = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * VectorTimestamp timestamp.
                 * @member {Array.<dxos.echo.testing.VectorTimestamp.IPart>} timestamp
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @instance
                 */
                VectorTimestamp.prototype.timestamp = $util.emptyArray;

                /**
                 * Creates a new VectorTimestamp instance using the specified properties.
                 * @function create
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @static
                 * @param {dxos.echo.testing.IVectorTimestamp=} [properties] Properties to set
                 * @returns {dxos.echo.testing.VectorTimestamp} VectorTimestamp instance
                 */
                VectorTimestamp.create = function create(properties) {
                    return new VectorTimestamp(properties);
                };

                /**
                 * Encodes the specified VectorTimestamp message. Does not implicitly {@link dxos.echo.testing.VectorTimestamp.verify|verify} messages.
                 * @function encode
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @static
                 * @param {dxos.echo.testing.IVectorTimestamp} message VectorTimestamp message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                VectorTimestamp.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.timestamp != null && message.timestamp.length)
                        for (var i = 0; i < message.timestamp.length; ++i)
                            $root.dxos.echo.testing.VectorTimestamp.Part.encode(message.timestamp[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    return writer;
                };

                /**
                 * Encodes the specified VectorTimestamp message, length delimited. Does not implicitly {@link dxos.echo.testing.VectorTimestamp.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @static
                 * @param {dxos.echo.testing.IVectorTimestamp} message VectorTimestamp message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                VectorTimestamp.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a VectorTimestamp message from the specified reader or buffer.
                 * @function decode
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {dxos.echo.testing.VectorTimestamp} VectorTimestamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                VectorTimestamp.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.VectorTimestamp();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            if (!(message.timestamp && message.timestamp.length))
                                message.timestamp = [];
                            message.timestamp.push($root.dxos.echo.testing.VectorTimestamp.Part.decode(reader, reader.uint32()));
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a VectorTimestamp message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {dxos.echo.testing.VectorTimestamp} VectorTimestamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                VectorTimestamp.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a VectorTimestamp message.
                 * @function verify
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                VectorTimestamp.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.timestamp != null && message.hasOwnProperty("timestamp")) {
                        if (!Array.isArray(message.timestamp))
                            return "timestamp: array expected";
                        for (var i = 0; i < message.timestamp.length; ++i) {
                            var error = $root.dxos.echo.testing.VectorTimestamp.Part.verify(message.timestamp[i]);
                            if (error)
                                return "timestamp." + error;
                        }
                    }
                    return null;
                };

                /**
                 * Creates a VectorTimestamp message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {dxos.echo.testing.VectorTimestamp} VectorTimestamp
                 */
                VectorTimestamp.fromObject = function fromObject(object) {
                    if (object instanceof $root.dxos.echo.testing.VectorTimestamp)
                        return object;
                    var message = new $root.dxos.echo.testing.VectorTimestamp();
                    if (object.timestamp) {
                        if (!Array.isArray(object.timestamp))
                            throw TypeError(".dxos.echo.testing.VectorTimestamp.timestamp: array expected");
                        message.timestamp = [];
                        for (var i = 0; i < object.timestamp.length; ++i) {
                            if (typeof object.timestamp[i] !== "object")
                                throw TypeError(".dxos.echo.testing.VectorTimestamp.timestamp: object expected");
                            message.timestamp[i] = $root.dxos.echo.testing.VectorTimestamp.Part.fromObject(object.timestamp[i]);
                        }
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a VectorTimestamp message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @static
                 * @param {dxos.echo.testing.VectorTimestamp} message VectorTimestamp
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                VectorTimestamp.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.timestamp = [];
                    if (message.timestamp && message.timestamp.length) {
                        object.timestamp = [];
                        for (var j = 0; j < message.timestamp.length; ++j)
                            object.timestamp[j] = $root.dxos.echo.testing.VectorTimestamp.Part.toObject(message.timestamp[j], options);
                    }
                    return object;
                };

                /**
                 * Converts this VectorTimestamp to JSON.
                 * @function toJSON
                 * @memberof dxos.echo.testing.VectorTimestamp
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                VectorTimestamp.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                VectorTimestamp.Part = (function() {

                    /**
                     * Properties of a Part.
                     * @memberof dxos.echo.testing.VectorTimestamp
                     * @interface IPart
                     * @property {Uint8Array|null} [feedKey] Part feedKey
                     * @property {number|null} [feedIndex] Part feedIndex
                     * @property {number|null} [seq] Part seq
                     */

                    /**
                     * Constructs a new Part.
                     * @memberof dxos.echo.testing.VectorTimestamp
                     * @classdesc Represents a Part.
                     * @implements IPart
                     * @constructor
                     * @param {dxos.echo.testing.VectorTimestamp.IPart=} [properties] Properties to set
                     */
                    function Part(properties) {
                        if (properties)
                            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                                if (properties[keys[i]] != null)
                                    this[keys[i]] = properties[keys[i]];
                    }

                    /**
                     * Part feedKey.
                     * @member {Uint8Array} feedKey
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @instance
                     */
                    Part.prototype.feedKey = $util.newBuffer([]);

                    /**
                     * Part feedIndex.
                     * @member {number} feedIndex
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @instance
                     */
                    Part.prototype.feedIndex = 0;

                    /**
                     * Part seq.
                     * @member {number} seq
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @instance
                     */
                    Part.prototype.seq = 0;

                    /**
                     * Creates a new Part instance using the specified properties.
                     * @function create
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @static
                     * @param {dxos.echo.testing.VectorTimestamp.IPart=} [properties] Properties to set
                     * @returns {dxos.echo.testing.VectorTimestamp.Part} Part instance
                     */
                    Part.create = function create(properties) {
                        return new Part(properties);
                    };

                    /**
                     * Encodes the specified Part message. Does not implicitly {@link dxos.echo.testing.VectorTimestamp.Part.verify|verify} messages.
                     * @function encode
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @static
                     * @param {dxos.echo.testing.VectorTimestamp.IPart} message Part message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Part.encode = function encode(message, writer) {
                        if (!writer)
                            writer = $Writer.create();
                        if (message.feedKey != null && Object.hasOwnProperty.call(message, "feedKey"))
                            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.feedKey);
                        if (message.feedIndex != null && Object.hasOwnProperty.call(message, "feedIndex"))
                            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.feedIndex);
                        if (message.seq != null && Object.hasOwnProperty.call(message, "seq"))
                            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.seq);
                        return writer;
                    };

                    /**
                     * Encodes the specified Part message, length delimited. Does not implicitly {@link dxos.echo.testing.VectorTimestamp.Part.verify|verify} messages.
                     * @function encodeDelimited
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @static
                     * @param {dxos.echo.testing.VectorTimestamp.IPart} message Part message or plain object to encode
                     * @param {$protobuf.Writer} [writer] Writer to encode to
                     * @returns {$protobuf.Writer} Writer
                     */
                    Part.encodeDelimited = function encodeDelimited(message, writer) {
                        return this.encode(message, writer).ldelim();
                    };

                    /**
                     * Decodes a Part message from the specified reader or buffer.
                     * @function decode
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @param {number} [length] Message length if known beforehand
                     * @returns {dxos.echo.testing.VectorTimestamp.Part} Part
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Part.decode = function decode(reader, length) {
                        if (!(reader instanceof $Reader))
                            reader = $Reader.create(reader);
                        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.dxos.echo.testing.VectorTimestamp.Part();
                        while (reader.pos < end) {
                            var tag = reader.uint32();
                            switch (tag >>> 3) {
                            case 1:
                                message.feedKey = reader.bytes();
                                break;
                            case 2:
                                message.feedIndex = reader.int32();
                                break;
                            case 3:
                                message.seq = reader.int32();
                                break;
                            default:
                                reader.skipType(tag & 7);
                                break;
                            }
                        }
                        return message;
                    };

                    /**
                     * Decodes a Part message from the specified reader or buffer, length delimited.
                     * @function decodeDelimited
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @static
                     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                     * @returns {dxos.echo.testing.VectorTimestamp.Part} Part
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    Part.decodeDelimited = function decodeDelimited(reader) {
                        if (!(reader instanceof $Reader))
                            reader = new $Reader(reader);
                        return this.decode(reader, reader.uint32());
                    };

                    /**
                     * Verifies a Part message.
                     * @function verify
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @static
                     * @param {Object.<string,*>} message Plain object to verify
                     * @returns {string|null} `null` if valid, otherwise the reason why it is not
                     */
                    Part.verify = function verify(message) {
                        if (typeof message !== "object" || message === null)
                            return "object expected";
                        if (message.feedKey != null && message.hasOwnProperty("feedKey"))
                            if (!(message.feedKey && typeof message.feedKey.length === "number" || $util.isString(message.feedKey)))
                                return "feedKey: buffer expected";
                        if (message.feedIndex != null && message.hasOwnProperty("feedIndex"))
                            if (!$util.isInteger(message.feedIndex))
                                return "feedIndex: integer expected";
                        if (message.seq != null && message.hasOwnProperty("seq"))
                            if (!$util.isInteger(message.seq))
                                return "seq: integer expected";
                        return null;
                    };

                    /**
                     * Creates a Part message from a plain object. Also converts values to their respective internal types.
                     * @function fromObject
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @static
                     * @param {Object.<string,*>} object Plain object
                     * @returns {dxos.echo.testing.VectorTimestamp.Part} Part
                     */
                    Part.fromObject = function fromObject(object) {
                        if (object instanceof $root.dxos.echo.testing.VectorTimestamp.Part)
                            return object;
                        var message = new $root.dxos.echo.testing.VectorTimestamp.Part();
                        if (object.feedKey != null)
                            if (typeof object.feedKey === "string")
                                $util.base64.decode(object.feedKey, message.feedKey = $util.newBuffer($util.base64.length(object.feedKey)), 0);
                            else if (object.feedKey.length)
                                message.feedKey = object.feedKey;
                        if (object.feedIndex != null)
                            message.feedIndex = object.feedIndex | 0;
                        if (object.seq != null)
                            message.seq = object.seq | 0;
                        return message;
                    };

                    /**
                     * Creates a plain object from a Part message. Also converts values to other types if specified.
                     * @function toObject
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @static
                     * @param {dxos.echo.testing.VectorTimestamp.Part} message Part
                     * @param {$protobuf.IConversionOptions} [options] Conversion options
                     * @returns {Object.<string,*>} Plain object
                     */
                    Part.toObject = function toObject(message, options) {
                        if (!options)
                            options = {};
                        var object = {};
                        if (options.defaults) {
                            if (options.bytes === String)
                                object.feedKey = "";
                            else {
                                object.feedKey = [];
                                if (options.bytes !== Array)
                                    object.feedKey = $util.newBuffer(object.feedKey);
                            }
                            object.feedIndex = 0;
                            object.seq = 0;
                        }
                        if (message.feedKey != null && message.hasOwnProperty("feedKey"))
                            object.feedKey = options.bytes === String ? $util.base64.encode(message.feedKey, 0, message.feedKey.length) : options.bytes === Array ? Array.prototype.slice.call(message.feedKey) : message.feedKey;
                        if (message.feedIndex != null && message.hasOwnProperty("feedIndex"))
                            object.feedIndex = message.feedIndex;
                        if (message.seq != null && message.hasOwnProperty("seq"))
                            object.seq = message.seq;
                        return object;
                    };

                    /**
                     * Converts this Part to JSON.
                     * @function toJSON
                     * @memberof dxos.echo.testing.VectorTimestamp.Part
                     * @instance
                     * @returns {Object.<string,*>} JSON object
                     */
                    Part.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                    };

                    return Part;
                })();

                return VectorTimestamp;
            })();

            return testing;
        })();

        return echo;
    })();

    return dxos;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && Object.hasOwnProperty.call(message, "type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                var message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
