import React from 'react'
import { useState } from 'react';
import Aside from '../layout/Aside';

const UserReferral = () => {

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div>
        <Aside isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
    </div>
  )
}

export default UserReferral;