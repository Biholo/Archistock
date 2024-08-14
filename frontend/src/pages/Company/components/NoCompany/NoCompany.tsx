import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NoCompany() {
    const navigate = useNavigate()
    return (
        <div>
            <h2>Select Choice</h2>
            {/* Contenu pour sélectionner une option */}
            <div onClick={() => navigate('/company/create')}>Create</div>
            <div onClick={() => navigate('/company/find')}>Join</div>
        </div>)
}
