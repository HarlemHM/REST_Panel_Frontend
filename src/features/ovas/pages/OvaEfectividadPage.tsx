import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from '../../../components/layout/Header';
import { LoadingSpinner, ErrorState } from '../../../components/shared';
import { ovaApi } from '../../../api';
import type { OvaEfectividad } from '../../../types';
import { EfectividadView } from '../components/EfectividadView';

export default function OvaEfectividadPage() {
  const navigate = useNavigate();
  const [efectividad, setEfectividad] = useState<OvaEfectividad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setLoading(true);
    setError('');
    try {
      setEfectividad(await ovaApi.efectividadGlobal());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar la efectividad');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  if (error || !efectividad) return <ErrorState message={error || 'Sin datos'} onRetry={cargar} />;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/ovas')}
          className="text-text-secondary hover:text-text-primary cursor-pointer"
          aria-label="Volver a OVAs"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <Header
            title="Efectividad de los OVAs"
            subtitle="Resultados agregados de todas las asignaciones"
          />
        </div>
      </div>

      <EfectividadView efectividad={efectividad} />
    </div>
  );
}
