/* Serviço somente de leitura do Supabase para o dashboard TermoLogic. */
(function (global) {
  'use strict';

  function connect(config) {
    if (!global.supabase || typeof global.supabase.createClient !== 'function') {
      throw new Error('SDK do Supabase não foi carregado.');
    }
    if (!config || !config.url || !config.anonKey) {
      throw new Error('Configure a URL do projeto e a chave pública do Supabase no código.');
    }

    return global.supabase.createClient(config.url, config.anonKey);
  }

  async function fetchRecords(client, tableName) {
    if (!client) throw new Error('A conexão com o Supabase não foi inicializada.');
    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Informe o nome da tabela do Supabase.');
    }

    const { data, error } = await client.from(tableName).select('*');
    if (error) throw error;
    return data || [];
  }

  global.TermologicSupabase = Object.freeze({
    connect,
    fetchRecords
  });
})(window);
