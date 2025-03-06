import { ApolloDriverConfig, Plugin } from "@nestjs/apollo";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlOptionsFactory } from "@nestjs/graphql";
import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server";
import { GraphQLError } from "graphql";

@Injectable()
export class GraphQLConfigService implements GqlOptionsFactory {
    constructor(private configService: ConfigService) { }

    createGqlOptions(): ApolloDriverConfig {
        const options: ApolloDriverConfig = {
            autoSchemaFile: true,
            // context: ({ req }) => {
            //     return {
            //         req,
            //         headers: req.headers,
            //     };
            // },
            playground: Boolean(this.configService.get<boolean>('GRAPHQL_PLAYGROUND')),
            plugins: [],
        }
        return options;
    }
}

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
    async requestDidStart(): Promise<GraphQLRequestListener<any>> {
        return {
            async didResolveSource({ source }) {
                console.log('Source resolved:', source);
            },

            async parsingDidStart() {
                console.log('Parsing started');
            },

            async validationDidStart() {
                console.log('Validation started');
            },

            async didResolveOperation({ operation }) {
                console.log('Operation resolved:', operation);
            },

            async didEncounterErrors({ errors }) {
                errors.forEach((error: GraphQLError) => {
                    console.error('Encountered error during processing:', error.message);
                });
            },

            async responseForOperation({ request, response }) {
                console.log('Generating response for operation:', request.operationName);
                return null;
            },

            async executionDidStart() {
                console.log('Execution started');
            },

            async willSendResponse({ response }) {
                if (response.body) {
                    if (response.body.kind === 'single') {
                        const singleResult = response.body.singleResult;

                        if (singleResult.errors && singleResult.errors.length > 0) {
                            singleResult.errors.forEach((error) => {
                                console.error('Error in response:', error.message);
                            });
                        } else {
                            console.log('No errors in single result');
                        }
                    } else if (response.body.kind === 'incremental') {
                        const initialResult = response.body.initialResult;

                        if (initialResult.errors && initialResult.errors.length > 0) {
                            initialResult.errors.forEach((error) => {
                                console.error('Error in initial result:', error.message);
                            });
                        } else {
                            console.log('No errors in initial result');
                        }
                    }
                } else {
                    console.warn('Response body is undefined');
                }
            },

            async didEncounterSubsequentErrors({ errors }) {
                errors.forEach((error: GraphQLError) => {
                    console.error('Subsequent error:', error.message);
                });
            },

            async willSendSubsequentPayload(requestContext, payload) {
                console.log('Will send subsequent payload:', payload);
            },
        };
    }
}