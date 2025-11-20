import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {API_ENDPOINT, http} from '../../../../assets/api/commons.js';
import CustomAlert from '../../../commons/admin/CustomAlert.jsx';
import Box from "../../../commons/admin/boxs/Box.jsx";
import AgGrid from "../../../commons/admin/grids/AgGrid.jsx";
import AdminSearchBox from "../../../commons/admin/boxs/SearchBox.jsx";
import Btn from "../../../commons/admin/forms/Btn.jsx";

const ChatbotUsageStatusManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
}