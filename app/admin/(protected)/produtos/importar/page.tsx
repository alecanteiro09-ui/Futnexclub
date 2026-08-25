import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductImportWizard } from "@/components/admin/ProductImportWizard";

export default function ImportarProdutosPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/produtos" className="mb-2 inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Voltar para produtos
        </Link>
        <h1 className="h2-display">Importar produtos</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-muted">
          Envie um arquivo CSV para cadastrar vários produtos de uma vez, com fotos incluídas via URL. Compatível com o
          formato de exportação da Shopify (products_export.csv) e com um modelo simplificado próprio.
        </p>
        <a href="/templates/modelo-importacao-produtos.csv" download className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
          Baixar modelo CSV
        </a>
      </div>

      <ProductImportWizard />

      <div className="card-surface mt-8 max-w-3xl space-y-2 p-6 text-sm text-ink-muted">
        <p className="font-semibold text-ink">Colunas aceitas</p>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <strong className="text-ink">nome / title</strong> — obrigatório
          </li>
          <li>
            <strong className="text-ink">time / team / vendor</strong> — obrigatório (times novos são criados automaticamente)
          </li>
          <li>
            <strong className="text-ink">temporada / season</strong>, <strong className="text-ink">categoria / category</strong> (casa, fora, alternativa,
            retro, selecao, outro)
          </li>
          <li>
            <strong className="text-ink">descricao / body (html)</strong>
          </li>
          <li>
            <strong className="text-ink">preco / price</strong> e <strong className="text-ink">preco_de / compare at price</strong>
          </li>
          <li>
            <strong className="text-ink">tamanhos / sizes</strong> — separados por vírgula ou barra, ex: P|M|G|GG
          </li>
          <li>
            <strong className="text-ink">imagem_url / image src</strong> — uma URL por linha; repita o mesmo <strong className="text-ink">handle</strong>{" "}
            em várias linhas para adicionar mais fotos ao mesmo produto, ou use <strong className="text-ink">imagens</strong> com várias URLs separadas
            por barra na mesma linha
          </li>
          <li>
            <strong className="text-ink">ativo / published</strong>, <strong className="text-ink">destaque</strong>,{" "}
            <strong className="text-ink">mais_vendido</strong>, <strong className="text-ink">lancamento</strong>
          </li>
        </ul>
        <p>
          As imagens precisam estar publicamente acessíveis (JPG, PNG ou WEBP, até 8MB) — o site baixa cada uma e guarda uma cópia própria no
          Storage.
        </p>
        <p>
          Não há limite de produtos por arquivo. Para catálogos muito grandes (centenas de produtos com várias fotos
          cada), a importação pode demorar alguns minutos — não feche a página enquanto ela estiver rodando.
        </p>
      </div>
    </div>
  );
}
