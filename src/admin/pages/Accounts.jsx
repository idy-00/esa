import { useCallback, useEffect, useState } from 'react'
import { UserPlus, Trash2, KeyRound, Loader2, Save } from 'lucide-react'
import { api, post, formatDateTime } from '../api'
import { useAuth, useConfirm, useToast } from '../context'
import { TextField, Field } from '../fields'

function generatePassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  const bytes = crypto.getRandomValues(new Uint32Array(12))
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

function MyAccount() {
  const { user, setUser } = useAuth()
  const toast = useToast()
  const [name, setName] = useState(user.name)
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [busy, setBusy] = useState(false)

  const saveName = async (e) => {
    e.preventDefault()
    try {
      const data = await post('update_profile', { name })
      setUser(data.user)
      toast.success('Nom mis à jour.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (password !== confirmPwd) return toast.error('Les deux nouveaux mots de passe ne correspondent pas.')
    setBusy(true)
    try {
      await post('change_password', { current, password })
      toast.success('Mot de passe modifié.')
      setCurrent('')
      setPassword('')
      setConfirmPwd('')
    } catch (err) {
      toast.error(err.message)
    }
    setBusy(false)
  }

  return (
    <div className="adm-grid-2">
      <form className="adm-card" onSubmit={saveName}>
        <h2>Mon profil</h2>
        <TextField label="Nom affiché" value={name} onChange={setName} maxLength={80} required />
        <Field label="Email de connexion"><input className="adm-input" value={user.email} disabled /></Field>
        <button className="adm-btn adm-btn-primary" disabled={name.trim() === user.name || !name.trim()}><Save size={16} /> Enregistrer</button>
      </form>

      <form className="adm-card" onSubmit={savePassword}>
        <h2>Changer mon mot de passe</h2>
        <TextField label="Mot de passe actuel" type="password" autoComplete="current-password" value={current} onChange={setCurrent} required />
        <TextField label="Nouveau mot de passe" hint="10 caractères minimum." type="password" autoComplete="new-password" value={password} onChange={setPassword} minLength={10} required />
        <TextField label="Confirmer le nouveau mot de passe" type="password" autoComplete="new-password" value={confirmPwd} onChange={setConfirmPwd} minLength={10} required />
        <button className="adm-btn adm-btn-primary" disabled={busy}>
          {busy ? <Loader2 size={16} className="adm-spin" /> : <KeyRound size={16} />} Changer le mot de passe
        </button>
      </form>
    </div>
  )
}

function Team() {
  const { user } = useAuth()
  const confirm = useConfirm()
  const toast = useToast()
  const [users, setUsers] = useState(null)
  const [form, setForm] = useState(null)
  const [created, setCreated] = useState(null)

  const load = useCallback(() => {
    api('users').then((d) => setUsers(d.items)).catch((err) => toast.error(err.message))
  }, [toast])
  useEffect(load, [load])

  const create = async (e) => {
    e.preventDefault()
    try {
      await post('create_user', form)
      setCreated({ email: form.email, password: form.password })
      setForm(null)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetPassword = async (u) => {
    if (!(await confirm({ title: `Réinitialiser le mot de passe de ${u.name} ?`, message: 'Un nouveau mot de passe provisoire va être généré. Communiquez-le à la personne.', confirmLabel: 'Réinitialiser' }))) return
    const password = generatePassword()
    try {
      await post('reset_password', { id: u.id, password })
      setCreated({ email: u.email, password })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const remove = async (u) => {
    if (!(await confirm({ title: `Supprimer le compte de ${u.name} ?`, message: 'Cette personne ne pourra plus se connecter au dashboard.', confirmLabel: 'Supprimer', danger: true }))) return
    try {
      await post('delete_user', { id: u.id })
      toast.success('Compte supprimé.')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <div>
          <h2>Comptes ayant accès au dashboard</h2>
          <p className="adm-muted">Les « éditeurs » gèrent le contenu ; les « administrateurs » peuvent aussi gérer les comptes.</p>
        </div>
        {!form && (
          <button className="adm-btn adm-btn-primary" onClick={() => { setCreated(null); setForm({ name: '', email: '', role: 'editor', password: generatePassword() }) }}>
            <UserPlus size={18} /> Ajouter une personne
          </button>
        )}
      </div>

      {created && (
        <div className="adm-alert adm-alert-success">
          <strong>Identifiants à transmettre :</strong><br />
          Adresse : {window.location.origin}/admin<br />
          Email : {created.email}<br />
          Mot de passe provisoire : <code>{created.password}</code><br />
          <small>Notez-le maintenant : il ne sera plus affiché. La personne pourra le changer dans « Mon compte ».</small>
        </div>
      )}

      {form && (
        <form className="adm-inline-form adm-subcard" onSubmit={create}>
          <div className="adm-row">
            <TextField label="Nom" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} maxLength={80} />
            <TextField label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </div>
          <div className="adm-row">
            <Field label="Rôle">
              {(fid) => (
                <select id={fid} className="adm-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="editor">Éditeur (gère le contenu)</option>
                  <option value="admin">Administrateur (contenu + comptes)</option>
                </select>
              )}
            </Field>
            <TextField label="Mot de passe provisoire" hint="Généré automatiquement, modifiable." value={form.password} onChange={(v) => setForm({ ...form, password: v })} minLength={10} required />
          </div>
          <div className="adm-form-actions">
            <button type="button" className="adm-btn" onClick={() => setForm(null)}>Annuler</button>
            <button className="adm-btn adm-btn-primary"><UserPlus size={16} /> Créer le compte</button>
          </div>
        </form>
      )}

      {!users ? <Loader2 className="adm-spin" /> : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Dernière connexion</th><th /></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}{u.id === user.id && <span className="adm-badge-text"> (vous)</span>}</td>
                  <td>{u.email}</td>
                  <td><span className={`adm-badge ${u.role === 'admin' ? 'is-blue' : ''}`}>{u.role === 'admin' ? 'Administrateur' : 'Éditeur'}</span></td>
                  <td>{u.lastLogin ? formatDateTime(u.lastLogin) : 'Jamais'}</td>
                  <td className="adm-table-actions">
                    {u.id !== user.id && (
                      <>
                        <button className="adm-icon-btn" title="Réinitialiser le mot de passe" aria-label="Réinitialiser le mot de passe" onClick={() => resetPassword(u)}><KeyRound size={16} /></button>
                        <button className="adm-icon-btn is-danger" title="Supprimer le compte" aria-label="Supprimer le compte" onClick={() => remove(u)}><Trash2 size={16} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function Accounts() {
  const { user } = useAuth()
  return (
    <div className="adm-page">
      <div className="adm-page-head">
        <div>
          <h1>{user.role === 'admin' ? 'Comptes' : 'Mon compte'}</h1>
        </div>
      </div>
      <MyAccount />
      {user.role === 'admin' && <Team />}
    </div>
  )
}
