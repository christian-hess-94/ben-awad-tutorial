## MikroORM

<details>
<summary>Conectando ao banco de dados</summary>

- Abra o arquivo `mikro-orm.config.ts`
- Especifique o `host` e `port` do banco de dados

  - Caso esteja localhost, o host e port serão avaliados para o padrão de acordo com o "type" do banco de dados
  - Por exemplo, o type `postgresql` tem como valores padrão:

  ```js
  //mikro-orm.config.ts
  {
    host: 'localhost',
    port: '5432'
  }
  ```

  </details>

<br/>

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

## GraphQL

<details>
<summary>Types</summary>

> ### Types permitem que o GraphQL possa realizar a introspecção de dados e mapeiam os tipos de dados presentes no GraphQL

<br/>

> ### **Como criar**
>
> - **O type do GraphQL é criado a partir da entity do MikroORM**
>   - **Siga o tutorial de como criar a Entity antes de transformá-la em um GraphQL Type**
> - Adicione a `@ObjectType()` notation na classe de entity
> - Adicione `@Field()` para quais campos da entity devem ser expostos pelo GraphQL
> - use `@Field(() => tipo)` para especificar o tipo do parâmetro (necessario em alguns > tipos de dados como Date e outro types criados (relacionamentos))

</details>

<br/>

<details>
<summary>Resolvers</summary>

> ### Resolvers contém a lógica executada quando uma chamada é feita ao GraphQL e retorna os dados necessários

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
>   @Arg("nomeArg", () => TipoArg) nomeVarNoResolver: tipoVarNoResolver,
>   ...outrosArgumentos
> ){
>   nomeVarNoResolver //Chamar diretamente
>   //Código a ser executado
> }
> ```
>
> > #### **Atenção**
> >
> > - O trecho `() => TipoArg` é opcional. Em alguns casos, o TypeScript consegue associar o tipo da variável ao tipo do argumento automaticamente.
> > - Nesse caso, o código seria alterado para:
> >
> > ```js
> > @Arg("nomeArg") nomeVarNoResolver: tipoVarNoResolver //Associa o tipoVarNoResolver automaticamente
> > ```
> >
> > - Isso normalmente funciona com tipos básicos de variaveis (`number`, `string`, etc) e com `InputTypes`
>
> - Para todos os efeitos, se faz um mapeamento entre o nome do argumento recebido no GraphQL para uma variavel que será usada no corpo do método
> - Também pode fazer uso de `InputTypes` quando o mesmo formato de parâmetros é usado multiplas vezes. Veja a proxima seção para saber como criar um `InputType`

</details>

<br/>

<details>
<summary>Input Types</summary>

> ### Quando for passar parâmetros para uma operação no GraphQL, pode-se criar InputTypes para melhor compor o >código

 <br/>

> ### **Como criar**
>
> - Normalmente o `InputType` é usado dentro de um Resolver para obter dados de um determinado `Type`. Por esse motivo, a melhor prática é inserir o código do `InputType` dentro do arquivo do `Resolver` > > correspondente.
> - O arquivo de `InputType` é parecido com o arquivo de `Type`, porém a anotação usada muda:
>
> ```js
> //resolver.ts
> @InputType()
> class InputTypeName {
>   @Field()
>   field1!: string;
>   @Field()
>   field2!: string;
> }
> //Resto do código
> ```

</details>

<br/>
<details>
<summary>Contexto Global</summary>

> ### O GraphQL possui um objeto de contexto com variáveis que podem ser acessadas por qualquer resolvers

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
