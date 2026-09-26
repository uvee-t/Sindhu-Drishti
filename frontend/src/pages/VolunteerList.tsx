import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { EmptyBlock, ErrorBlock, LoadingBlock } from '../components/ui/State'
import { alertApi } from '../services/alertApi'

export default function VolunteerList(){
  const query=useQuery({queryKey:['volunteers'],queryFn:alertApi.getVolunteers})
  const [search,setSearch]=useState('')
  const volunteers=query.data?.volunteers??[]
  const rows=useMemo(()=>volunteers.filter(volunteer=>[volunteer.name,volunteer.email,volunteer.vehicle,...volunteer.skills].filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase())),[volunteers,search])
  const date=(value?:string)=>value?new Intl.DateTimeFormat(undefined,{dateStyle:'medium'}).format(new Date(value)):'—'
  return <div className="page volunteer-page"><div className="page-intro"><div><p className="eyebrow">RESPONSE NETWORK</p><h1>Volunteer List</h1><span>Available volunteers registered for your district’s emergency response network.</span></div><div className="sync-note">District {query.data?.district??'—'} · {query.data?.count??volunteers.length} volunteers</div></div>{query.isError?<ErrorBlock retry={()=>query.refetch()} label="Unable to load volunteers"/>:query.isLoading?<LoadingBlock label="Loading volunteers…"/>:<section className="table-card"><div className="table-tools"><input placeholder="Search volunteers" value={search} onChange={event=>setSearch(event.target.value)}/><span>{rows.length} of {volunteers.length} volunteers</span></div>{!rows.length?<EmptyBlock label={search?'No volunteers match your search.':'No volunteers are currently registered for this district.'}/>:<div className="table-wrap"><table className="volunteer-table"><thead><tr><th>Volunteer</th><th>Skills</th><th>Location</th><th>Availability</th><th>Vehicle</th><th>Registered</th></tr></thead><tbody>{rows.map(volunteer=><tr key={volunteer.id}><td><b>{volunteer.name}</b><small>{volunteer.email}</small></td><td><div className="skill-list">{volunteer.skills.length?volunteer.skills.map(skill=><span key={skill}>{skill}</span>):'—'}</div></td><td>{Number.isFinite(volunteer.latitude)&&Number.isFinite(volunteer.longitude)?<span className="coordinates">{volunteer.latitude.toFixed(5)}, {volunteer.longitude.toFixed(5)}</span>:'—'}</td><td><span className={`availability ${volunteer.availability?'available':'unavailable'}`}>{volunteer.availability?'Available':'Unavailable'}</span></td><td>{volunteer.vehicle||'—'}</td><td>{date(volunteer.created_at)}</td></tr>)}</tbody></table></div>}</section>}</div>
}
