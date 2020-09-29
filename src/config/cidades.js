import { baseApiUrl } from '@/global'
import axios from 'axios'

export async function cidadeBusca (pesquisa) {
  if (pesquisa) {
    return await axios
      .post(`${baseApiUrl}/cidades`, { name: pesquisa })
  }
}

export default { cidadeBusca }
