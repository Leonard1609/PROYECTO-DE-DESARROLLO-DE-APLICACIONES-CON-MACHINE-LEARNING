import React, { useEffect, useState } from 'react';
import { TramiteController } from '../controllers/TramiteController';

export const ListaTramites = () => {
    const [tramites, setTramites] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // La Vista le pide los datos al Controlador
        TramiteController.listarTramitesParaEmpleado(setTramites, setCargando);
    }, []);

    if (cargando) return <p>Cargando trámites prioritarios...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Panel de Gestión de Trámites - Priorización ML</h2> [cite: 4, 10]
            <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>ID</th>
                        <th>Tipo de Trámite</th>
                        <th>Prioridad (AI)</th> 
                        <th>Estado</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {tramites.map((tramite) => (
                        <tr key={tramite.id_tramite} style={{ 
                            borderLeft: tramite.prioridad_ml === 'Alta' ? '5px solid red' : '5px solid green' 
                        }}>
                            <td>{tramite.id_tramite}</td>
                            <td>{tramite.tipo_tramite}</td>
                            <td>
                                <strong>{tramite.prioridad_ml}</strong>
                            </td>
                            <td>{tramite.estado}</td>
                            <td>
                                <button onClick={() => TramiteController.procesarTrámite(tramite.id_tramite, 'Aprobado')}>
                                    Aprobar y Notificar
                                </button> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};