import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button, Chip, TextField, Card, Grid } from "@mui/material";

// project imports
// import config from 'config';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';

import { gridSpacing } from 'store/constant';
import { fetchSkill } from '../../api/database';
import { SET_SKILL_ID } from '../../store/actions';

// ===============================|| Skill BOX ||=============================== //

const SkillBox = ({ skillId, label }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    // 保存 skillId 到 Redux
    dispatch({ type: SET_SKILL_ID, skillId });
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 1 }}>
      <Box
        component={Link}
        to="/skill-detail"
        onClick={handleClick} // 在点击时调用保存逻辑
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
          bgcolor: 'primary.light',
          color: 'grey.800',
          cursor: 'pointer', // 讓游標變為手形，表示這是一個可點擊區域
          textDecoration: 'none' // 取消超連結底線
        }}
      >
        {!label && <Box sx={{ color: 'inherit' }}>boxShadow: {shadow}</Box>}
        {label && <Box sx={{ color: 'inherit' }}>{label}</Box>}
      </Box>
    </Card>
  );
};

SkillBox.propTypes = {
  label: PropTypes.string.isRequired
};

// ============================|| UTILITIES SHADOW ||============================ //

const SkillPage = () => {
  const theme = useTheme();
  
  const skillIds = [1, 2];

  // 狀態來存儲技能數據
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 讓組件在第一次渲染時執行 fetchSkill()
  // 空的依賴數組[]表示該副作用只在組件第一次掛載時執行一次。
  useEffect(() => {
    const fetchUserSkills = async () => {
      setLoading(true);  // Set loading to true at the start
      try {
        const results = [];
        for (const skillId of skillIds) {
          try {
            const skill = await fetchSkill(skillId);
            results.push(skill); // 成功請求時加入結果
          } catch (err) {
            console.error(`Error fetching skill ${skillId}:`, err);
            results.push(null); // 請求失敗時記錄為 null
          }
        }
        setSkills(results.filter((skill) => skill !== null)); // 過濾掉失敗的請求
      } catch (err) {
        setError("An error occurred while fetching skills.");
        console.error(err);
      } finally {
        setLoading(false); // 結束加載
      }
    };

    if (skillIds.length > 0) {
      fetchUserSkills();
    } else {
      setLoading(false); // 如果沒有技能 ID，直接停止加載
    }
  }, []);
  
  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (error) {
    return <Typography variant="body1" color="error">{error}</Typography>;
  }  

  return skills?.length > 0 ? (
    <MainCard title="Skill">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SubCard title="In progress">
            <Grid container spacing={2}>
              {skills.filter(skill => skill.status === 1).map(skill => (
                <Grid key={skill.id} item xs={12} sm={6} md={4} lg={3}>
                  <SkillBox skillId={skill.id} label={skill.name} />
                </Grid>
              ))}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <SkillBox skillId={-1} label='+' />
              </Grid>
            </Grid>
          </SubCard>
        </Grid>
        <Grid item xs={12}>
          <SubCard title="Finished">
            <Grid container spacing={2}>
              {skills.filter(skill => skill.category === 'Finished').map(skill => (
                <Grid key={skill.id} item xs={12} sm={6} md={4} lg={3}>
                  <SkillBox label={skill.name} />
                </Grid>
              ))}
            </Grid>
          </SubCard>
        </Grid>
      </Grid>
    </MainCard>
  ) : (
    <Typography variant="body1">No skill available</Typography>
  );
  
};

export default SkillPage;

//{items.map((item, index) => (
//  <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
//    <Paper>{item}</Paper>
//  </Grid>