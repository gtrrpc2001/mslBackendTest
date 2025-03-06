import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { createGraphQLModule } from "factory/fun.factory";
import { GraphqlHeaderMiddleware } from "middleware/graphql.middleware";
import { UserModule } from "module/user.module";

export const graphqlModule = [
    UserModule,
    createGraphQLModule(),
]

@Module({
    imports: graphqlModule,
    controllers: [],
    providers: [],
})

export class GrathModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(GraphqlHeaderMiddleware)
            .forRoutes('/graphql');
    }
}