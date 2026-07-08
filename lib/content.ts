// Fonte unica de conteudo da PDP. Editar aqui sem mexer nos componentes.

export type Offer = {
  sku: string;
  label: string;
  units: number;
  price: number;
  perServing: number; // R$ por porcao
  servings: number; // total de porcoes
  highlight?: boolean;
  badge?: string;
};

export const product = {
  name: "Açaí Liofilizado em Pó",
  weight: "100g",
  h1: "Açaí de verdade, agora em pó.",
  subtitle:
    "100% açaí liofilizado do Norte do Brasil. Prepare bowls, smoothies e receitas em segundos — sem freezer, sem açúcar e sem desperdício.",
  heroYield: {
    powder: "100g",
    powderLabel: "em pó",
    prepared: "até 1kg",
    preparedLabel: "preparado",
  },
  heroBadges: [
    "100% natural",
    "Sem açúcar adicionado",
    "Freeze dried",
    "Até 20 porções",
  ],
};

export const offers: Offer[] = [
  { sku: "ob-100-1", label: "1 unidade", units: 1, price: 89.9, perServing: 4.5, servings: 20 },
  { sku: "ob-100-2", label: "Kit 2 unidades", units: 2, price: 169.9, perServing: 4.25, servings: 40, highlight: true, badge: "Mais escolhido" },
  { sku: "ob-100-3", label: "Kit 3 unidades", units: 3, price: 239.9, perServing: 4.0, servings: 60, badge: "Melhor economia" },
];

export const trustItems: { icon: IconName; label: string }[] = [
  { icon: "leaf", label: "100% natural" },
  { icon: "drop", label: "Fonte natural de compostos antioxidantes" },
  { icon: "snow", label: "Freeze dried (liofilizado)" },
  { icon: "nosugar", label: "Sem açúcar adicionado" },
];

export const benefits: { title: string; text: string; icon: IconName; highlight?: boolean }[] = [
  { title: "Rende até 20 porções", text: "100g que duram. Custo baixo por porção, açaí de verdade todo dia.", icon: "servings", highlight: true },
  { title: "Sem freezer", text: "Guarde na prateleira. Leve na bolsa ou na viagem — sem depender de congelador.", icon: "shelf", highlight: true },
  { title: "Prático", text: "Uma colher e está pronto. Sem descongelar, sem liquidificador complexo.", icon: "clock" },
  { title: "Versátil", text: "Smoothie, bowl, iogurte, vitamina e receitas do dia a dia.", icon: "bowl" },
  { title: "Sem açúcar adicionado", text: "Açaí puro, do jeito que deveria ser.", icon: "nosugar" },
  { title: "Nutrientes preservados", text: "Liofilização a frio conserva melhor que a secagem por calor.", icon: "leaf" },
];

export const comparison: { feature: string; over: string; pulp: string }[] = [
  { feature: "Armazenamento", over: "Prateleira, seco", pulp: "Freezer obrigatório" },
  { feature: "Açúcar", over: "Sem açúcar adicionado", pulp: "Muitas têm xarope/açúcar" },
  { feature: "Preparo", over: "1 colher, pronto", pulp: "Descongelar, sujeira" },
  { feature: "Transporte", over: "Leve, leva na bolsa", pulp: "Precisa de gelo/freezer" },
  { feature: "Rendimento", over: "Até 20 porções por 100g", pulp: "Volumoso, rende menos" },
  { feature: "Validade", over: "24 meses", pulp: "Curta, depende do freezer" },
];

export const uses: { title: string; text: string; icon: IconName }[] = [
  { title: "Smoothie", text: "Banana + leite ou bebida vegetal + 1 scoop + gelo. Bate e pronto.", icon: "bowl" },
  { title: "Bowl", text: "Iogurte ou base gelada + 1 scoop, finalize com frutas e granola.", icon: "bowl" },
  { title: "Iogurte ou vitamina", text: "Misture 1 scoop no iogurte ou na vitamina do dia.", icon: "drop" },
  { title: "No shake", text: "Adicione ao shake, vitamina ou receita do dia.", icon: "spoon" },
];

export const nutrition: { label: string; value: string; strong?: boolean }[] = [
  { label: "Valor energético", value: "25 kcal" },
  { label: "Carboidratos", value: "0,6 g" },
  { label: "Açúcares totais", value: "0 g" },
  { label: "Açúcares adicionados", value: "0 g", strong: true },
  { label: "Proteínas", value: "0,4 g" },
  { label: "Gorduras totais", value: "2,3 g" },
  { label: "Gorduras saturadas", value: "0 g" },
  { label: "Gorduras trans", value: "0 g" },
  { label: "Fibras alimentares", value: "1,5 g" },
  { label: "Sódio", value: "0 mg" },
];

export const specs: { label: string; value: string }[] = [
  { label: "Peso líquido", value: "100 g" },
  { label: "Rendimento", value: "Até 20 porções" },
  { label: "Origem", value: "Amazônia Brasileira" },
  { label: "Processo", value: "Liofilização (Freeze Dried)" },
  { label: "Validade", value: "24 meses" },
  { label: "Armazenamento", value: "Local seco e arejado" },
];

export const faq: { q: string; a: string }[] = [
  { q: "Tem açúcar?", a: "Não. Sem açúcar adicionado. É açaí puro liofilizado." },
  { q: "Precisa congelar?", a: "Não. Guarde em local seco e arejado, na prateleira." },
  { q: "Quanto rende?", a: "Até 20 porções por pacote de 100g (1 scoop = 5g)." },
  { q: "Como usar?", a: "Misture 1 scoop em smoothies, bowls, iogurtes, vitaminas ou receitas." },
  { q: "Qual a diferença para a polpa?", a: "É prático (sem freezer), sem açúcar adicionado, leve e com validade longa." },
  { q: "Qual o sabor?", a: "Açaí puro, sem adoçantes. Você ajusta o doce como preferir." },
  { q: "Qual a validade?", a: "24 meses. Depois de aberto, mantenha bem fechado em local seco." },
];

export type IconName =
  | "leaf" | "drop" | "snow" | "nosugar" | "spoon" | "shelf"
  | "bowl" | "servings" | "clock" | "check" | "shield" | "lock" | "doc" | "bag";
