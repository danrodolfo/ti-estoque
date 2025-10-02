import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface UserPermissions {
  can_view_estoque: boolean;
  can_add_estoque: boolean;
  can_edit_estoque: boolean;
  can_delete_estoque: boolean;
  can_view_movimentados: boolean;
  can_add_movimentados: boolean;
  can_edit_movimentados: boolean;
  can_delete_movimentados: boolean;
  can_view_comodato: boolean;
  can_add_comodato: boolean;
  can_edit_comodato: boolean;
  can_delete_comodato: boolean;
  can_view_dashboard: boolean;
}

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPermissions(null);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const fetchPermissions = async () => {
      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      const userIsAdmin = !!roleData;
      setIsAdmin(userIsAdmin);

      // If admin, grant all permissions
      if (userIsAdmin) {
        setPermissions({
          can_view_estoque: true,
          can_add_estoque: true,
          can_edit_estoque: true,
          can_delete_estoque: true,
          can_view_movimentados: true,
          can_add_movimentados: true,
          can_edit_movimentados: true,
          can_delete_movimentados: true,
          can_view_comodato: true,
          can_add_comodato: true,
          can_edit_comodato: true,
          can_delete_comodato: true,
          can_view_dashboard: true,
        });
      } else {
        // Fetch user permissions
        const { data: permData } = await supabase
          .from('user_permissions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (permData) {
          setPermissions(permData);
        }
      }

      setLoading(false);
    };

    fetchPermissions();
  }, [user]);

  return { permissions, isAdmin, loading };
};
