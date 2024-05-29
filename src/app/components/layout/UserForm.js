'use client';
import EditableImage from "./EditableImage";
import { useProfile } from "../UseProfile";
import {useState} from "react";
import AddressInputs from "./AdressInput";


export default function UserForm({user,onSave}) {
  const [userName, setUserName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [postalCode, setPostalCode] = useState(user?.postalCode || '');
  const [city, setCity] = useState(user?.city || '');
  const [admin, setAdmin] = useState(user?.admin || false);
  const {data:loggedInUserData} = useProfile();

  function handleAddressChange(propName, value) {
    if (propName === 'phone') setPhone(value);
    if (propName === 'streetAddress') setStreetAddress(value);
    if (propName === 'postalCode') setPostalCode(value);
    if (propName === 'city') setCity(value);
  }

  return (    
    <div className="md:flex gap-4">
      <div>        
        <div className="p-2 rounded-lg relative max-w-[120px]">
          <EditableImage link={image} setLink={setImage} />
        </div>
      </div>
      <form
        className="grow"
        onSubmit={ev =>
          onSave(ev, {
            name:userName, image, phone, admin,
            streetAddress, city, postalCode,
          })
        }
      >
        <h1>Complete seu cadastro:</h1>
        <label>
          Primeiro e último nome
        </label>
        <input
          type="text" placeholder="Primeiro e último nome"
          value={userName} onChange={ev => setUserName(ev.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          disabled={true}
          value={user.email}
          placeholder={'email'}
        />
          <AddressInputs 
          addressProps={{phone, streetAddress, postalCode, city}}
          setAddressProp={handleAddressChange}
          />
          
          {loggedInUserData && (
          <div>
            <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
              <input
                id="adminCb" type="checkbox" className="" value={'1'}
                checked={admin}
                onChange={ev => setAdmin(ev.target.checked)}
              />
              <span>Caso esteja criando um abrigo, clique aqui!</span>
            </label>
          </div>
        )}
        <button type="submit" className="text-gray-500">Salvar</button>
      </form>
    </div>
  );
}