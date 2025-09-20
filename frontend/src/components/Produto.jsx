import { useState,useEffect } from "react";
import axios from "axios";
 
const Produto = () => {
    // DECLARANDO A URL DA API QUE SERA CONSUMIDA
    const API_URL = "http://localhost:3001/produto";
 
    // HOOK - useState Mainupla o estado da variavel
    const [produto, setProduto] = useState([]);
    const [novoProduto, setNovoProduto] = useState({nome:"",descricao:""});
    const [editar, setEditar] = useState(false);
    const [pesquisar,setPesquisar]=useState("");

    // CADASTRAR PRODUTO
    const cadastrarProduto = async ()=>{
        // VALIDAR CAMPOS
        if(!novoProduto.nome || !novoProduto.descricao){
            alert("Campos obrigatórios")
            return;
        }
 
        // TRATAMENTO DE ERROS
        try{
            const response = await axios.post(API_URL,novoProduto);
            setProduto([...produto,response.data])
            setNovoProduto({nome:"",descricao:""})
            setEditar(false);
        }
        catch(error){
            console.log("Erro ao cadastrar o produto", error)
        }
    }
 
    // CONSULTAR PRODUTOS CADASTRADOS
    const consultarProdutos = async()=>{
        try{
            // VERIFICA SE TROUXE UMA PESQUISA ESPECÍFICA SE NÃO DEVOLVE A LISTA COM TODOS
            const url = pesquisar ? `${API_URL}/search?pesquisa=${pesquisar}` : API_URL
            const response = await axios.get(url);
            setProduto(response.data);
        }
        catch(error){
            console.log("Erro ao consultao produto", error)
        }
    }

    // HOOK useEffect - EFEITO PARA CARREGAR A LISTA DE TODOS OS PRODUTOS CADASTRADOS
    useEffect(()=>{
        const timer = setTimeout(()=>{
            consultarProdutos();
        },300) //3 segundos
        return ()=>clearTimeout(timer)
        },[pesquisar])
 
    // ALTERAR PRODUTO CADASTRADO
    const alterarProduto = async()=>{
        if(!novoProduto.nome || !novoProduto.descricao){
            alert("Campos obrigatórios")
            return;
        }
 
        // TRATAMENTO DE ERROS
        try{
            const response = await axios.put(`${API_URL}/${novoProduto.id}`, novoProduto)
            setProduto(produto.map(produto => produto.id === novoProduto.id ? response.data : produto))
            setNovoProduto({nome:"",descricao:""})
            setEditar(false);
        }
        catch(error){
            console.log("Erro ao alterar produto", error)
        }
    }
 
    // DELETAR O PRODUTO CADASTRADO
    const deletarProduto = async(id)=>{
        if(window.confirm("Tem certeza que deseja deletar este produto")){
            try{
                await axios.delete(`${API_URL}/${id}`);
                setProduto(produto.filter((item)=>item.id !== id));
            }
            catch(error){
                console.log("Error ao excluir um produto", error)
            }
        }
        else{
            console.log("Exclusão do produto cancelada")
        }
    }
 
    // METODO ALTERAR
    const handleAlterar=(produto)=>{
        setNovoProduto(produto)
        setEditar(true);
    }
 
    // METODO SUBIR QUE VAI ATUALIZAR O BOTÃO DO FORMULARIO
    const handleSubmit =()=>{
        if(editar){
            alterarProduto();
        }
        else{
            cadastrarProduto();
        }
    }
 
  return(
    <div className="bg-gradient-to-r from-blue-400 to-blue-900 mx-auto p-4 min-h-screen">
      <h1 className="m-8 text-center font-bold text-white text-2xl border bg-black w-80 mx-auto ">Cadastro de Produto</h1>
      <form className="mb-4">
        <div>
            <input 
                type="text" 
                placeholder="Pesquisar..." 
                value={pesquisar}
                onChange={(e)=>setPesquisar(e.target.value)}
                className="w-[300px] pl-4 pr-4 py-2 border border-gray-800 text-white rounded-full"     
            />
        </div>
        <div className="mb-4">
          <label className="font-bold text-xl block m-3">Nome Produto</label>
          <input className="border-2 rounded-md bg-gray-300 ml-3 p-1 w-[250px] h-[40px]"
           type="text"
           id="nome"
           placeholder="Digite o nome do produto"
           value={novoProduto.nome} //pega a variavel do useState
            // pega o que o for digitado no campo    
           onChange={(e)=>setNovoProduto({...novoProduto, nome: e.target.value})}
           
           />
        </div>
 
        <div className="mb-4">
          <label className="font-bold text-xl block m-3">Descrição Produto</label>
          <input className="border-2 rounded-md bg-gray-300 ml-3 p-1 w-[250px] h-[40px]"
            type="text"
            id="descricao"
            placeholder="Digite descrição do produto"
            value={novoProduto.descricao}
            onChange={(e)=>setNovoProduto({...novoProduto, descricao : e.target.value})}
          />
        </div>
            <button className="border-2 p-2 rounded-full bg-green-500 font-semibold hover:bg-green-700 cursor-pointer pl-3 pr-3"
                onClick={handleSubmit}>
                {editar ? "Alterar" : "Cadastrar"}
            </button>
      </form>
      <ul>
        {produto.map(item =>(
        <li key={item.id} className="border-2 p-2 mb-4 rounded flex items-center justify-between bg-gray-300">
            <div>
                <strong className="font-semibold">{item.nome}-</strong>{item.descricao}
            </div>
            <div>
                <button onClick={()=>handleAlterar(item)}
                className="bg-amber-300 hover:bg-yellow-600 cursor-pointer text-black font-bold py-2 px-2 rounded mr-2">Editar</button>
                <button onClick={()=>deletarProduto(item.id)}
                     className="bg-red-500 hover:bg-red-600 cursor-pointer text-black font-bold py-2 px-2 rounded mr-2">Deletar</button>
            </div>
        </li>
        ))}     
      </ul>
    </div>
  );
};

export default Produto;