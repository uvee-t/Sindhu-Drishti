import { X } from 'lucide-react'
import type { ApiRecord } from '../../types/gis'
import { prettyKey, prettyValue } from '../../utils/normalize'
export function DetailDrawer({title,data,onClose}:{title:string;data?:ApiRecord;onClose:()=>void}) { if(!data)return null; return <aside className="detail-drawer"><button onClick={onClose}><X size={17}/></button><p>FEATURE DETAILS</p><h2>{title}</h2><dl>{Object.entries(data).filter(([,v])=>v !== undefined && typeof v !== 'object').map(([k,v])=><div key={k}><dt>{prettyKey(k)}</dt><dd>{prettyValue(v)}</dd></div>)}</dl>{Boolean(data.geometry)&&<div className="geometry-note">Geometry: {String((data.geometry as {type?:string}).type ?? 'Available')}</div>}</aside> }
