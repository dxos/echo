import * as $protobuf from "protobufjs";
/** Namespace dxos. */
export namespace dxos {

    /** Namespace echo. */
    namespace echo {

        /** Namespace testing. */
        namespace testing {

            /** Properties of a FeedEnvelope. */
            interface IFeedEnvelope {

                /** FeedEnvelope payload */
                payload?: (google.protobuf.IAny|null);
            }

            /** Represents a FeedEnvelope. */
            class FeedEnvelope implements IFeedEnvelope {

                /**
                 * Constructs a new FeedEnvelope.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IFeedEnvelope);

                /** FeedEnvelope payload. */
                public payload?: (google.protobuf.IAny|null);

                /**
                 * Creates a new FeedEnvelope instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns FeedEnvelope instance
                 */
                public static create(properties?: dxos.echo.testing.IFeedEnvelope): dxos.echo.testing.FeedEnvelope;

                /**
                 * Encodes the specified FeedEnvelope message. Does not implicitly {@link dxos.echo.testing.FeedEnvelope.verify|verify} messages.
                 * @param message FeedEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IFeedEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified FeedEnvelope message, length delimited. Does not implicitly {@link dxos.echo.testing.FeedEnvelope.verify|verify} messages.
                 * @param message FeedEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IFeedEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a FeedEnvelope message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns FeedEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.FeedEnvelope;

                /**
                 * Decodes a FeedEnvelope message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns FeedEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.FeedEnvelope;

                /**
                 * Verifies a FeedEnvelope message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a FeedEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns FeedEnvelope
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.FeedEnvelope;

                /**
                 * Creates a plain object from a FeedEnvelope message. Also converts values to other types if specified.
                 * @param message FeedEnvelope
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.FeedEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this FeedEnvelope to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a FeedMessage. */
            interface IFeedMessage {

                /** FeedMessage payload */
                payload?: (google.protobuf.IAny|null);

                /** FeedMessage feedKey */
                feedKey?: (Uint8Array|null);

                /** FeedMessage identityKey */
                identityKey?: (Uint8Array|null);
            }

            /** Represents a FeedMessage. */
            class FeedMessage implements IFeedMessage {

                /**
                 * Constructs a new FeedMessage.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IFeedMessage);

                /** FeedMessage payload. */
                public payload?: (google.protobuf.IAny|null);

                /** FeedMessage feedKey. */
                public feedKey: Uint8Array;

                /** FeedMessage identityKey. */
                public identityKey: Uint8Array;

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

            /** Properties of a FeedGenesis. */
            interface IFeedGenesis {

                /** FeedGenesis partyGenesis */
                partyGenesis?: (dxos.echo.testing.IPartyGenesis|null);
            }

            /** Represents a FeedGenesis. */
            class FeedGenesis implements IFeedGenesis {

                /**
                 * Constructs a new FeedGenesis.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IFeedGenesis);

                /** FeedGenesis partyGenesis. */
                public partyGenesis?: (dxos.echo.testing.IPartyGenesis|null);

                /**
                 * Creates a new FeedGenesis instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns FeedGenesis instance
                 */
                public static create(properties?: dxos.echo.testing.IFeedGenesis): dxos.echo.testing.FeedGenesis;

                /**
                 * Encodes the specified FeedGenesis message. Does not implicitly {@link dxos.echo.testing.FeedGenesis.verify|verify} messages.
                 * @param message FeedGenesis message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IFeedGenesis, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified FeedGenesis message, length delimited. Does not implicitly {@link dxos.echo.testing.FeedGenesis.verify|verify} messages.
                 * @param message FeedGenesis message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IFeedGenesis, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a FeedGenesis message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns FeedGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.FeedGenesis;

                /**
                 * Decodes a FeedGenesis message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns FeedGenesis
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.FeedGenesis;

                /**
                 * Verifies a FeedGenesis message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a FeedGenesis message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns FeedGenesis
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.FeedGenesis;

                /**
                 * Creates a plain object from a FeedGenesis message. Also converts values to other types if specified.
                 * @param message FeedGenesis
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.FeedGenesis, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this FeedGenesis to JSON.
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

            /** Properties of a VectorTimestamp. */
            interface IVectorTimestamp {

                /** VectorTimestamp timestamp */
                timestamp?: (dxos.echo.testing.VectorTimestamp.IFeed[]|null);
            }

            /** Represents a VectorTimestamp. */
            class VectorTimestamp implements IVectorTimestamp {

                /**
                 * Constructs a new VectorTimestamp.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IVectorTimestamp);

                /** VectorTimestamp timestamp. */
                public timestamp: dxos.echo.testing.VectorTimestamp.IFeed[];

                /**
                 * Creates a new VectorTimestamp instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns VectorTimestamp instance
                 */
                public static create(properties?: dxos.echo.testing.IVectorTimestamp): dxos.echo.testing.VectorTimestamp;

                /**
                 * Encodes the specified VectorTimestamp message. Does not implicitly {@link dxos.echo.testing.VectorTimestamp.verify|verify} messages.
                 * @param message VectorTimestamp message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IVectorTimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified VectorTimestamp message, length delimited. Does not implicitly {@link dxos.echo.testing.VectorTimestamp.verify|verify} messages.
                 * @param message VectorTimestamp message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IVectorTimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a VectorTimestamp message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns VectorTimestamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.VectorTimestamp;

                /**
                 * Decodes a VectorTimestamp message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns VectorTimestamp
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.VectorTimestamp;

                /**
                 * Verifies a VectorTimestamp message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a VectorTimestamp message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns VectorTimestamp
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.VectorTimestamp;

                /**
                 * Creates a plain object from a VectorTimestamp message. Also converts values to other types if specified.
                 * @param message VectorTimestamp
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.VectorTimestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this VectorTimestamp to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace VectorTimestamp {

                /** Properties of a Feed. */
                interface IFeed {

                    /** Feed feedKey */
                    feedKey?: (Uint8Array|null);

                    /** Feed feedIndex */
                    feedIndex?: (number|null);

                    /** Feed seq */
                    seq?: (number|null);
                }

                /** Represents a Feed. */
                class Feed implements IFeed {

                    /**
                     * Constructs a new Feed.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: dxos.echo.testing.VectorTimestamp.IFeed);

                    /** Feed feedKey. */
                    public feedKey: Uint8Array;

                    /** Feed feedIndex. */
                    public feedIndex: number;

                    /** Feed seq. */
                    public seq: number;

                    /**
                     * Creates a new Feed instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Feed instance
                     */
                    public static create(properties?: dxos.echo.testing.VectorTimestamp.IFeed): dxos.echo.testing.VectorTimestamp.Feed;

                    /**
                     * Encodes the specified Feed message. Does not implicitly {@link dxos.echo.testing.VectorTimestamp.Feed.verify|verify} messages.
                     * @param message Feed message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: dxos.echo.testing.VectorTimestamp.IFeed, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Feed message, length delimited. Does not implicitly {@link dxos.echo.testing.VectorTimestamp.Feed.verify|verify} messages.
                     * @param message Feed message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: dxos.echo.testing.VectorTimestamp.IFeed, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Feed message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Feed
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.VectorTimestamp.Feed;

                    /**
                     * Decodes a Feed message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Feed
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.VectorTimestamp.Feed;

                    /**
                     * Verifies a Feed message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Feed message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Feed
                     */
                    public static fromObject(object: { [k: string]: any }): dxos.echo.testing.VectorTimestamp.Feed;

                    /**
                     * Creates a plain object from a Feed message. Also converts values to other types if specified.
                     * @param message Feed
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: dxos.echo.testing.VectorTimestamp.Feed, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Feed to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Properties of an ItemEnvelope. */
            interface IItemEnvelope {

                /** ItemEnvelope itemId */
                itemId?: (string|null);

                /** ItemEnvelope timestamp */
                timestamp?: (dxos.echo.testing.IVectorTimestamp|null);

                /** ItemEnvelope genesis */
                genesis?: (dxos.echo.testing.IItemGenesis|null);

                /** ItemEnvelope operation */
                operation?: (google.protobuf.IAny|null);
            }

            /** Represents an ItemEnvelope. */
            class ItemEnvelope implements IItemEnvelope {

                /**
                 * Constructs a new ItemEnvelope.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.IItemEnvelope);

                /** ItemEnvelope itemId. */
                public itemId: string;

                /** ItemEnvelope timestamp. */
                public timestamp?: (dxos.echo.testing.IVectorTimestamp|null);

                /** ItemEnvelope genesis. */
                public genesis?: (dxos.echo.testing.IItemGenesis|null);

                /** ItemEnvelope operation. */
                public operation?: (google.protobuf.IAny|null);

                /** ItemEnvelope action. */
                public action?: ("genesis"|"operation");

                /**
                 * Creates a new ItemEnvelope instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ItemEnvelope instance
                 */
                public static create(properties?: dxos.echo.testing.IItemEnvelope): dxos.echo.testing.ItemEnvelope;

                /**
                 * Encodes the specified ItemEnvelope message. Does not implicitly {@link dxos.echo.testing.ItemEnvelope.verify|verify} messages.
                 * @param message ItemEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.IItemEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ItemEnvelope message, length delimited. Does not implicitly {@link dxos.echo.testing.ItemEnvelope.verify|verify} messages.
                 * @param message ItemEnvelope message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.IItemEnvelope, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ItemEnvelope message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ItemEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.ItemEnvelope;

                /**
                 * Decodes an ItemEnvelope message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ItemEnvelope
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.ItemEnvelope;

                /**
                 * Verifies an ItemEnvelope message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ItemEnvelope message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ItemEnvelope
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.ItemEnvelope;

                /**
                 * Creates a plain object from an ItemEnvelope message. Also converts values to other types if specified.
                 * @param message ItemEnvelope
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.ItemEnvelope, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ItemEnvelope to JSON.
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

            /** Properties of a TestItemMutation. */
            interface ITestItemMutation {

                /** TestItemMutation key */
                key?: (string|null);

                /** TestItemMutation value */
                value?: (string|null);
            }

            /** Represents a TestItemMutation. */
            class TestItemMutation implements ITestItemMutation {

                /**
                 * Constructs a new TestItemMutation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.ITestItemMutation);

                /** TestItemMutation key. */
                public key: string;

                /** TestItemMutation value. */
                public value: string;

                /**
                 * Creates a new TestItemMutation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TestItemMutation instance
                 */
                public static create(properties?: dxos.echo.testing.ITestItemMutation): dxos.echo.testing.TestItemMutation;

                /**
                 * Encodes the specified TestItemMutation message. Does not implicitly {@link dxos.echo.testing.TestItemMutation.verify|verify} messages.
                 * @param message TestItemMutation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.ITestItemMutation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TestItemMutation message, length delimited. Does not implicitly {@link dxos.echo.testing.TestItemMutation.verify|verify} messages.
                 * @param message TestItemMutation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.ITestItemMutation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TestItemMutation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TestItemMutation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.TestItemMutation;

                /**
                 * Decodes a TestItemMutation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TestItemMutation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.TestItemMutation;

                /**
                 * Verifies a TestItemMutation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TestItemMutation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TestItemMutation
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.TestItemMutation;

                /**
                 * Creates a plain object from a TestItemMutation message. Also converts values to other types if specified.
                 * @param message TestItemMutation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.TestItemMutation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TestItemMutation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a TestMessage. */
            interface ITestMessage {

                /** TestMessage value */
                value?: (number|null);
            }

            /** Represents a TestMessage. */
            class TestMessage implements ITestMessage {

                /**
                 * Constructs a new TestMessage.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: dxos.echo.testing.ITestMessage);

                /** TestMessage value. */
                public value: number;

                /**
                 * Creates a new TestMessage instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TestMessage instance
                 */
                public static create(properties?: dxos.echo.testing.ITestMessage): dxos.echo.testing.TestMessage;

                /**
                 * Encodes the specified TestMessage message. Does not implicitly {@link dxos.echo.testing.TestMessage.verify|verify} messages.
                 * @param message TestMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: dxos.echo.testing.ITestMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TestMessage message, length delimited. Does not implicitly {@link dxos.echo.testing.TestMessage.verify|verify} messages.
                 * @param message TestMessage message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: dxos.echo.testing.ITestMessage, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TestMessage message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TestMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): dxos.echo.testing.TestMessage;

                /**
                 * Decodes a TestMessage message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TestMessage
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): dxos.echo.testing.TestMessage;

                /**
                 * Verifies a TestMessage message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TestMessage message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TestMessage
                 */
                public static fromObject(object: { [k: string]: any }): dxos.echo.testing.TestMessage;

                /**
                 * Creates a plain object from a TestMessage message. Also converts values to other types if specified.
                 * @param message TestMessage
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: dxos.echo.testing.TestMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TestMessage to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
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
