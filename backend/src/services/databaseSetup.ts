/**
 * A estrutura do banco Supabase é administrada por SQL/migrations revisadas.
 * Este arquivo é mantido apenas para compatibilidade com a organização do projeto.
 * A inicialização do servidor NÃO executa DDL nem altera tabelas automaticamente.
 */
export async function prepararEstruturaComplementar(): Promise<void> {
  // Intencionalmente vazio: não modificar o banco durante o boot da aplicação.
}
