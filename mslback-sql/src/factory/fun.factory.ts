import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLConfigService } from './graphql.factory';
import { ApolloDriver } from '@nestjs/apollo';

export function createGraphQLModule() {
    return GraphQLModule.forRootAsync({
        imports: [ConfigModule],
        useClass: GraphQLConfigService,
        inject: [ConfigService],
        driver: ApolloDriver,

    });
}
