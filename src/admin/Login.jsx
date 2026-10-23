import { useState } from 'react'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { useAuth } from './context'
import logo from '../assets/logo.jpg'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <img src={logo} alt="ESA" className="adm-login-logo" />
        <h1>Espace administration</h1>
        <p>Connectez-vous pour gérer les actualités et la vie étudiante du site.</p>

        <div className="adm-field">
          <label htmlFor="login-email">Adresse email</label>
          <input id="login-email" className="adm-input" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </div>
        <div className="adm-field">
          <label htmlFor="login-password">Mot de passe</label>
          <div className="adm-password">
            <input id="login-password" className="adm-input" type={show ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <div className="adm-alert adm-alert-error" role="alert">{error}</div>}

        <button className="adm-btn adm-btn-primary adm-btn-block" disabled={busy}>
          {busy ? <Loader2 size={18} className="adm-spin" /> : <Lock size={18} />}
          Se connecter
        </button>
        <a href="/" className="adm-login-back">← Retour au site</a>
      </form>
    </div>
  )
}
