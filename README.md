## MikroORM

<details>
<summary>Entities do banco de dados</summary>

> ### Entities são responsáveis por fazer a interação do serviço nodejs com o banco de dados através da dependencia `MikroORM`

<br/>

> ### **Como criar**
>
> - Criar o arquivo `NomeDaEntity.ts` dentro da pasta `src/entities`
> - A entity é uma class anotada com `@Entity()`
> - Crie as colunas da tabela e anote as com `@Property()`
> - Adicione um objeto dentro de `@Property()` caso queira modificar o tipo e os valores >padrões da coluna:
>
> > `@Property({ type: "tipo", default: "" }) coluna: tipo;`
>
> - Importe e adicione a nova entity dentro de `src/mikro-orm.config.ts`
>
> ```js
> //src/mikro-orm.config.ts
> export default {
>   entities: [...Entities, NovaEntity], // Adicione aqui
>   ...params,
> } as Parameters<typeof MikroORM.init>[0];
> ```
>
> - Execute o npm script 'create-migration'
> - `yarn run create-migration`
> - `npm run create-migration`
> - Dentro da pasta `src/migrations` aparece um novo arquivo. Dentro do arquivo está o >comando SQL a ser executado
> - As migrations são executadas quando o servidor der reload
> - A migration detecta as novas entities adicionadas e atualiza o banco de dados de acordo com as migrations

</details>

---

## Graph-QL

<details>
<summary>Types no Graph-QL</summary>

> ### Types permitem que o Graph-QL possa realizar a introspecção de dados e mapeiam os tipos de dados presentes no Graph-QL

<br/>

> ### **Como criar**
>
> - **O type do Graph-QL é criado a partir da entity do MikroORM**
>   - **Siga o tutorial de como criar a Entity antes de transformá-la em um Graph-QL Type**
> - Adicione a `@ObjectType()` notation na classe de entity
> - Adicione `@Field()` para quais campos da entity devem ser expostos pelo Graph-QL
> - use `@Field(() => tipo)` para especificar o tipo do parâmetro (necessario em alguns > tipos de dados como Date e outro types criados (relacionamentos))

</details>

<br/>

<details>
<summary>Resolvers para o Graph-QL</summary>

> ### Resolvers contém a lógica executada quando uma chamada é feita ao Graph-QL e retorna os dados necessários

<br/>

> ### **Como criar um novo resolver**
>
> - Crie o arquivo de resolvers dentro da pasta `src/resolvers`
> - O arquivo será uma classe com a anotação `@Resolver()`
> - Crie métodos dentro da classe que conterão a lógica
>   - Os métodos podem ser `async metodo() {}` caso sejam usadas promises no código
> - Anote cada método com `@Query()` (leitura) ou `@Mutation()`(escrita)
> - Abra o arquivo `index.ts`
> - Importe e adicione a referencia do novo resolver dentro do ApolloServer:
>
> ```js
> //index.ts
> const apolloServer = new ApolloServer({
>   schema: await buildSchema({
>     resolvers: [...resolvers, NovoResolver], // adicione aqui
>     ...params,
>   }),
>   ...params,
> });
> ```

> ### **Como criar uma Query ou Mutation**
>
> - Anote o método com `@Query()` ou `@Mutation()` dependendo do uso.
>   - Neste exemplo será usado `@Query()`, mas o código traduz para `@Mutation()`
> - Use `@Query(()=> Type)` para dizer o tipo de retorno da função.
> - Use `@Query(()=> [Type])` para indicar que será retornado um array
> - Em cada método, especifique o tipo de retorno com `: Promise<Type | null>`
>   - `| null` permite que o retorno possa ser null
>   - Caso utilize `| null`, adicione este trecho de código dentro de `@Query()`:
>     > `@Query(() => Type, { nullable: true })`

> ### **Como receber parâmetros**
>
> - Adicione o seguinte código como um dos parâmetros do método do resolver:
>
> ```js
> //YourResolver.ts
> @Query() //ou @Mutation()
> metodo(
>   @Arg("nomeDoArgumento", () => TipoDoArgumento) nomeDaVariavelNoResolver: tipoDaVariavelNoResolver,
>   ...outrosArgumentos
> ){
>   nomeDaVariavelNoResolver //Como acessar
>   //Código a ser executado
> }]
> ```
>
> - Para todos os efeitos, se faz um mapeamento entre o nome do argumento recebido no GraphQL para uma variavel que será usada no corpo do método

</details>
<br/>
<details>
<summary>Objeto de Contexto Graph-QL</summary>

> ### O Graph-QL possui um objeto de contexto com variáveis que podem ser acessadas por qualquer resolvers

<br/>

> ### **Como acessar os dados**
>
> - No resolver, adicione o seguinte código como um dos parâmetros do método:
>
> ```js
> //YourResolver.ts
> @Query(() => Type)
> metodo(@Ctx() ctx: MyContext){ //Adicione isto
> ctx.variavel_a_ser_acessada;
> //Resto do código
> }
> ```

> ### **Como adicionar novos valores no contexto**
>
> - Abra o arquivo `src/types`
> - Dentro da classe `MyContext`, adicione um novo parâmetro e especifique seu tipo
> - Abra o arquivo `index.ts`
> - Dentro da função `main()` adicione a variável dentro do parâmetro `context` do ApolloServer:
>
> ```js
> //index.ts
> //Inicialize a variável
> const apolloServer = new ApolloServer({
>   ...params,
>   context: () => ({ ...params, variavel: valor }), //adicione a nova variável
> });
> ```

</details>

---
