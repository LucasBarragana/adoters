import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function User() {
  const router = useRouter();
  const { email } = router.query;
  const { data: user, error } = useSWR(email ? `/api/users/${email}` : null, fetcher);

  if (error) return <div>Falha ao carregar usuário</div>;
  if (!user) return <div>Carregando...</div>;

  return (
    <div className="max-w-lg mx-auto my-10">
      <h1 className="text-2xl font-bold mb-4">Informações do Usuário</h1>
      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Outras informações do usuário */}
    </div>
  );
}
