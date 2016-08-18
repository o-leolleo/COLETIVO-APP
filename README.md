# COLETIVO-APP
A publish/subscribe application for a distributed systems course - more description later.

todo list (não necessariamente em ordem de prioridade):
- [ ] adicionar criptografia 
- [ ] adicionar dados de localização (raio de alcance da votação)
- [ ] adicionar persitência nos dados
- [ ] testar
- [ ] verificar bugs
- [ ] produzir documentação 

OBS.: o 2º e 3º serão adicionados apenas se o tempo for suficiente.
OBS 2.: a documentação pode ser feita no fim de semana.

bugs conhecidos:

* quando sai de uma votação finalizada, do lado do votante, é possível
retornar para o gráfico, através de botão na aba esquerda superior. Isso ocorre apesar de o tópico já ter sido excluido.

* Juiz e votante podem se inscrever ou criar, respectivamente, canais de mesmo ID.
