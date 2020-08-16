import * as $protobuf from "protobufjs";
/** Namespace dxos. */
export namespace dxos {

    /** Namespace echo. */
    namespace echo {

        /** Namespace testing. */
        namespace testing {

            /** Properties of a FeedMessage. */
            interface IFeedMessage {

                /** FeedMessage halo */
                halo?: (dxos.echo.testing.IHaloEnvelope|null);

                /** FeedMessage echo */
                echo?: (dxos.echo.testing.IEchoEnvelope|null);
            }

            /** Represents a FeedMessage. */
            class FeedMessage implements IFeedMessage {

                /**
                 * Constructs a new FeedMessage.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IFeedMessage);

                /** FeedMessage halo. */
                public halo?: (dxos.echo.testing.IHaloEnvelope|null);

                /** FeedMessage echo. */
                public echo?: (dxos.echo.testing.IEchoEnvelope|null);

                /**
                 * Creates a new FeedMessage instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns FeedMessage instance
                 */
                public static create(properties?: dxos.echo.testing.IFeedMessage): dxos.echo.testing.FeedMessage;

                /**
                 * Encodes the specified FeedMessage message. Does not implicitly {@link dxos.echo.testing.FeedMessage.verify|verify} messages.
                 * @param message FeedMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IFeedMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified FeedMessage message, length delimited. Does not implicitly {@link dxos.echo.testing.FeedMessage.verify|verify} messages.
                 * @param message FeedMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IFeedMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a FeedMessage message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns FeedMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.FeedMessage;

                /**
                 * Decodes a FeedMessage message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns FeedMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.FeedMessage;

                /**
                 * Verifies a FeedMessage message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a FeedMessage message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns FeedMessage
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.FeedMessage;

                /**
                 * Creates a plain object from a FeedMessage message. Also converts values to other types if specified.
                 * @param message FeedMessage
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.FeedMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this FeedMessage to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a HaloEnvelope. */
            interface IHaloEnvelope {

                /** HaloEnvelope genesis */
                genesis?: (dxos.echo.testing.IPartyGenesis|null);

                /** HaloEnvelope admit */
                admit?: (dxos.echo.testing.IPartyAdmit|null);

                /** HaloEnvelope eject */
                eject?: (dxos.echo.testing.IPartyEject|null);
            }

            /** Represents a HaloEnvelope. */
            class HaloEnvelope implements IHaloEnvelope {

                /**
                 * Constructs a new HaloEnvelope.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IHaloEnvelope);

                /** HaloEnvelope genesis. */
                public genesis?: (dxos.echo.testing.IPartyGenesis|null);

                /** HaloEnvelope admit. */
                public admit?: (dxos.echo.testing.IPartyAdmit|null);

                /** HaloEnvelope eject. */
                public eject?: (dxos.echo.testing.IPartyEject|null);

                /** HaloEnvelope action. */
                public action?: ("genesis"|"admit"|"eject");

                /**
                 * Creates a new HaloEnvelope instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns HaloEnvelope instance
                 */
                public static create(properties?: dxos.echo.testing.IHaloEnvelope): dxos.echo.testing.HaloEnvelope;

                /**
                 * Encodes the specified HaloEnvelope message. Does not implicitly {@link dxos.echo.testing.HaloEnvelope.verify|verify} messages.
                 * @param message HaloEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IHaloEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified HaloEnvelope message, length delimited. Does not implicitly {@link dxos.echo.testing.HaloEnvelope.verify|verify} messages.
                 * @param message HaloEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IHaloEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a HaloEnvelope message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns HaloEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.HaloEnvelope;

                /**
                 * Decodes a HaloEnvelope message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns HaloEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.HaloEnvelope;

                /**
                 * Verifies a HaloEnvelope message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a HaloEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns HaloEnvelope
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.HaloEnvelope;

                /**
                 * Creates a plain object from a HaloEnvelope message. Also converts values to other types if specified.
                 * @param message HaloEnvelope
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.HaloEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this HaloEnvelope to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PartyGenesis. */
            interface IPartyGenesis {

                /** PartyGenesis feedKey */
                feedKey?: (Uint8Array|null);
            }

            /** Represents a PartyGenesis. */
            class PartyGenesis implements IPartyGenesis {

                /**
                 * Constructs a new PartyGenesis.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IPartyGenesis);

                /** PartyGenesis feedKey. */
                public feedKey: Uint8Array;

                /**
                 * Creates a new PartyGenesis instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PartyGenesis instance
                 */
                public static create(properties?: dxos.echo.testing.IPartyGenesis): dxos.echo.testing.PartyGenesis;

                /**
                 * Encodes the specified PartyGenesis message. Does not implicitly {@link dxos.echo.testing.PartyGenesis.verify|verify} messages.
                 * @param message PartyGenesis message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IPartyGenesis, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PartyGenesis message, length delimited. Does not implicitly {@link dxos.echo.testing.PartyGenesis.verify|verify} messages.
                 * @param message PartyGenesis message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IPartyGenesis, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PartyGenesis message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PartyGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.PartyGenesis;

                /**
                 * Decodes a PartyGenesis message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PartyGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.PartyGenesis;

                /**
                 * Verifies a PartyGenesis message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PartyGenesis message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PartyGenesis
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.PartyGenesis;

                /**
                 * Creates a plain object from a PartyGenesis message. Also converts values to other types if specified.
                 * @param message PartyGenesis
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.PartyGenesis, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PartyGenesis to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PartyAdmit. */
            interface IPartyAdmit {

                /** PartyAdmit feedKey */
                feedKey?: (Uint8Array|null);
            }

            /** Represents a PartyAdmit. */
            class PartyAdmit implements IPartyAdmit {

                /**
                 * Constructs a new PartyAdmit.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IPartyAdmit);

                /** PartyAdmit feedKey. */
                public feedKey: Uint8Array;

                /**
                 * Creates a new PartyAdmit instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PartyAdmit instance
                 */
                public static create(properties?: dxos.echo.testing.IPartyAdmit): dxos.echo.testing.PartyAdmit;

                /**
                 * Encodes the specified PartyAdmit message. Does not implicitly {@link dxos.echo.testing.PartyAdmit.verify|verify} messages.
                 * @param message PartyAdmit message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IPartyAdmit, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PartyAdmit message, length delimited. Does not implicitly {@link dxos.echo.testing.PartyAdmit.verify|verify} messages.
                 * @param message PartyAdmit message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IPartyAdmit, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PartyAdmit message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PartyAdmit
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.PartyAdmit;

                /**
                 * Decodes a PartyAdmit message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PartyAdmit
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.PartyAdmit;

                /**
                 * Verifies a PartyAdmit message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PartyAdmit message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PartyAdmit
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.PartyAdmit;

                /**
                 * Creates a plain object from a PartyAdmit message. Also converts values to other types if specified.
                 * @param message PartyAdmit
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.PartyAdmit, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PartyAdmit to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PartyEject. */
            interface IPartyEject {

                /** PartyEject feedKey */
                feedKey?: (Uint8Array|null);
            }

            /** Represents a PartyEject. */
            class PartyEject implements IPartyEject {

                /**
                 * Constructs a new PartyEject.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IPartyEject);

                /** PartyEject feedKey. */
                public feedKey: Uint8Array;

                /**
                 * Creates a new PartyEject instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PartyEject instance
                 */
                public static create(properties?: dxos.echo.testing.IPartyEject): dxos.echo.testing.PartyEject;

                /**
                 * Encodes the specified PartyEject message. Does not implicitly {@link dxos.echo.testing.PartyEject.verify|verify} messages.
                 * @param message PartyEject message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IPartyEject, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PartyEject message, length delimited. Does not implicitly {@link dxos.echo.testing.PartyEject.verify|verify} messages.
                 * @param message PartyEject message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IPartyEject, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PartyEject message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PartyEject
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.PartyEject;

                /**
                 * Decodes a PartyEject message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PartyEject
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.PartyEject;

                /**
                 * Verifies a PartyEject message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PartyEject message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PartyEject
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.PartyEject;

                /**
                 * Creates a plain object from a PartyEject message. Also converts values to other types if specified.
                 * @param message PartyEject
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.PartyEject, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PartyEject to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an EchoEnvelope. */
            interface IEchoEnvelope {

                /** EchoEnvelope timeframe */
                timeframe?: (dxos.echo.testing.ITimeframe|null);

                /** EchoEnvelope itemId */
                itemId?: (string|null);

                /** EchoEnvelope genesis */
                genesis?: (dxos.echo.testing.IItemGenesis|null);

                /** EchoEnvelope itemMutation */
                itemMutation?: (dxos.echo.testing.IItemMutation|null);
            }

            /** Represents an EchoEnvelope. */
            class EchoEnvelope implements IEchoEnvelope {

                /**
                 * Constructs a new EchoEnvelope.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IEchoEnvelope);

                /** EchoEnvelope timeframe. */
                public timeframe?: (dxos.echo.testing.ITimeframe|null);

                /** EchoEnvelope itemId. */
                public itemId: string;

                /** EchoEnvelope genesis. */
                public genesis?: (dxos.echo.testing.IItemGenesis|null);

                /** EchoEnvelope itemMutation. */
                public itemMutation?: (dxos.echo.testing.IItemMutation|null);

                /** EchoEnvelope action. */
                public action?: ("genesis"|"itemMutation");

                /**
                 * Creates a new EchoEnvelope instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EchoEnvelope instance
                 */
                public static create(properties?: dxos.echo.testing.IEchoEnvelope): dxos.echo.testing.EchoEnvelope;

                /**
                 * Encodes the specified EchoEnvelope message. Does not implicitly {@link dxos.echo.testing.EchoEnvelope.verify|verify} messages.
                 * @param message EchoEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IEchoEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EchoEnvelope message, length delimited. Does not implicitly {@link dxos.echo.testing.EchoEnvelope.verify|verify} messages.
                 * @param message EchoEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IEchoEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EchoEnvelope message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EchoEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.EchoEnvelope;

                /**
                 * Decodes an EchoEnvelope message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EchoEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.EchoEnvelope;

                /**
                 * Verifies an EchoEnvelope message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EchoEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EchoEnvelope
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.EchoEnvelope;

                /**
                 * Creates a plain object from an EchoEnvelope message. Also converts values to other types if specified.
                 * @param message EchoEnvelope
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.EchoEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EchoEnvelope to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an ItemGenesis. */
            interface IItemGenesis {

                /** ItemGenesis itemType */
                itemType?: (string|null);

                /** ItemGenesis modelType */
                modelType?: (string|null);

                /** ItemGenesis modelVersion */
                modelVersion?: (string|null);
            }

            /** Represents an ItemGenesis. */
            class ItemGenesis implements IItemGenesis {

                /**
                 * Constructs a new ItemGenesis.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IItemGenesis);

                /** ItemGenesis itemType. */
                public itemType: string;

                /** ItemGenesis modelType. */
                public modelType: string;

                /** ItemGenesis modelVersion. */
                public modelVersion: string;

                /**
                 * Creates a new ItemGenesis instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ItemGenesis instance
                 */
                public static create(properties?: dxos.echo.testing.IItemGenesis): dxos.echo.testing.ItemGenesis;

                /**
                 * Encodes the specified ItemGenesis message. Does not implicitly {@link dxos.echo.testing.ItemGenesis.verify|verify} messages.
                 * @param message ItemGenesis message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IItemGenesis, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ItemGenesis message, length delimited. Does not implicitly {@link dxos.echo.testing.ItemGenesis.verify|verify} messages.
                 * @param message ItemGenesis message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IItemGenesis, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ItemGenesis message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ItemGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.ItemGenesis;

                /**
                 * Decodes an ItemGenesis message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ItemGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.ItemGenesis;

                /**
                 * Verifies an ItemGenesis message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ItemGenesis message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ItemGenesis
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.ItemGenesis;

                /**
                 * Creates a plain object from an ItemGenesis message. Also converts values to other types if specified.
                 * @param message ItemGenesis
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.ItemGenesis, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ItemGenesis to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an ItemMutation. */
            interface IItemMutation {

                /** ItemMutation set */
                set?: (dxos.echo.testing.ItemMutation.IProperty|null);

                /** ItemMutation append */
                append?: (dxos.echo.testing.ItemMutation.IProperty|null);
            }

            /** Represents an ItemMutation. */
            class ItemMutation implements IItemMutation {

                /**
                 * Constructs a new ItemMutation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IItemMutation);

                /** ItemMutation set. */
                public set?: (dxos.echo.testing.ItemMutation.IProperty|null);

                /** ItemMutation append. */
                public append?: (dxos.echo.testing.ItemMutation.IProperty|null);

                /**
                 * Creates a new ItemMutation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ItemMutation instance
                 */
                public static create(properties?: dxos.echo.testing.IItemMutation): dxos.echo.testing.ItemMutation;

                /**
                 * Encodes the specified ItemMutation message. Does not implicitly {@link dxos.echo.testing.ItemMutation.verify|verify} messages.
                 * @param message ItemMutation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IItemMutation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ItemMutation message, length delimited. Does not implicitly {@link dxos.echo.testing.ItemMutation.verify|verify} messages.
                 * @param message ItemMutation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IItemMutation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ItemMutation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ItemMutation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.ItemMutation;

                /**
                 * Decodes an ItemMutation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ItemMutation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.ItemMutation;

                /**
                 * Verifies an ItemMutation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ItemMutation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ItemMutation
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.ItemMutation;

                /**
                 * Creates a plain object from an ItemMutation message. Also converts values to other types if specified.
                 * @param message ItemMutation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.ItemMutation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ItemMutation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace ItemMutation {

                /** Properties of a Property. */
                interface IProperty {

                    /** Property key */
                    key?: (string|null);

                    /** Property value */
                    value?: (string|null);
                }

                /** Represents a Property. */
                class Property implements IProperty {

                    /**
                     * Constructs a new Property.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: dxos.echo.testing.ItemMutation.IProperty);

                    /** Property key. */
                    public key: string;

                    /** Property value. */
                    public value: string;

                    /**
                     * Creates a new Property instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Property instance
                     */
                    public static create(properties?: dxos.echo.testing.ItemMutation.IProperty): dxos.echo.testing.ItemMutation.Property;

                    /**
                     * Encodes the specified Property message. Does not implicitly {@link dxos.echo.testing.ItemMutation.Property.verify|verify} messages.
                     * @param message Property message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: dxos.echo.testing.ItemMutation.IProperty, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Property message, length delimited. Does not implicitly {@link dxos.echo.testing.ItemMutation.Property.verify|verify} messages.
                     * @param message Property message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: dxos.echo.testing.ItemMutation.IProperty, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Property message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Property
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.ItemMutation.Property;

                    /**
                     * Decodes a Property message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Property
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.ItemMutation.Property;

                    /**
                     * Verifies a Property message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Property message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Property
                     */
                    public static fromObject(object: { [k: string]: any }): dxos.echo.testing.ItemMutation.Property;

                    /**
                     * Creates a plain object from a Property message. Also converts values to other types if specified.
                     * @param message Property
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: dxos.echo.testing.ItemMutation.Property, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Property to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of a Timeframe. */
            interface ITimeframe {

                /** Timeframe frames */
                frames?: (dxos.echo.testing.Timeframe.IFrame[]|null);
            }

            /** Represents a Timeframe. */
            class Timeframe implements ITimeframe {

                /**
                 * Constructs a new Timeframe.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.ITimeframe);

                /** Timeframe frames. */
                public frames: dxos.echo.testing.Timeframe.IFrame[];

                /**
                 * Creates a new Timeframe instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Timeframe instance
                 */
                public static create(properties?: dxos.echo.testing.ITimeframe): dxos.echo.testing.Timeframe;

                /**
                 * Encodes the specified Timeframe message. Does not implicitly {@link dxos.echo.testing.Timeframe.verify|verify} messages.
                 * @param message Timeframe message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.ITimeframe, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Timeframe message, length delimited. Does not implicitly {@link dxos.echo.testing.Timeframe.verify|verify} messages.
                 * @param message Timeframe message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.ITimeframe, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Timeframe message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Timeframe
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.Timeframe;

                /**
                 * Decodes a Timeframe message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Timeframe
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.Timeframe;

                /**
                 * Verifies a Timeframe message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Timeframe message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Timeframe
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.Timeframe;

                /**
                 * Creates a plain object from a Timeframe message. Also converts values to other types if specified.
                 * @param message Timeframe
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.Timeframe, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Timeframe to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Timeframe {

                /** Properties of a Frame. */
                interface IFrame {

                    /** Frame feedKey */
                    feedKey?: (Uint8Array|null);

                    /** Frame feedIndex */
                    feedIndex?: (number|null);

                    /** Frame seq */
                    seq?: (number|null);
                }

                /** Represents a Frame. */
                class Frame implements IFrame {

                    /**
                     * Constructs a new Frame.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: dxos.echo.testing.Timeframe.IFrame);

                    /** Frame feedKey. */
                    public feedKey: Uint8Array;

                    /** Frame feedIndex. */
                    public feedIndex: number;

                    /** Frame seq. */
                    public seq: number;

                    /**
                     * Creates a new Frame instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Frame instance
                     */
                    public static create(properties?: dxos.echo.testing.Timeframe.IFrame): dxos.echo.testing.Timeframe.Frame;

                    /**
                     * Encodes the specified Frame message. Does not implicitly {@link dxos.echo.testing.Timeframe.Frame.verify|verify} messages.
                     * @param message Frame message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: dxos.echo.testing.Timeframe.IFrame, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Frame message, length delimited. Does not implicitly {@link dxos.echo.testing.Timeframe.Frame.verify|verify} messages.
                     * @param message Frame message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: dxos.echo.testing.Timeframe.IFrame, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Frame message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Frame
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.Timeframe.Frame;

                    /**
                     * Decodes a Frame message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Frame
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.Timeframe.Frame;

                    /**
                     * Verifies a Frame message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Frame message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Frame
                     */
                    public static fromObject(object: { [k: string]: any }): dxos.echo.testing.Timeframe.Frame;

                    /**
                     * Creates a plain object from a Frame message. Also converts values to other types if specified.
                     * @param message Frame
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: dxos.echo.testing.Timeframe.Frame, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Frame to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }
        }
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
