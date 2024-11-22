import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';

// material-ui
import { Box, Typography, Button, Chip, TextField, Card, Grid } from "@mui/material";

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SubCard from 'ui-component/cards/SubCard';
import { fetchSkill, editSkill } from '../../api/database';

// ==============================|| SAMPLE PAGE ||============================== //

const SkillDetail = () => {
  // 狀態來存儲技能數據
  const [skill, setSkill] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // 新增状态控制编辑模式

  const navigate = useNavigate();
  const skillId = useSelector((state) => state.customization.skillId);

  // 讓組件在第一次渲染時執行 fetchSkill()
  // 空的依賴數組[]表示該副作用只在組件第一次掛載時執行一次。
  useEffect(() => {
    const getSkill = async () => {
      try {
          const fetchedSkill = await fetchSkill(skillId);
          setSkill(fetchedSkill);  // Set the fetched skill data
      } catch (err) {
          setError(err.message);  // Set error message
      } finally {
        setLoading(false);  // 无论成功还是失败，加载状态都更新为 false
    }
  };

  getSkill();  // Call the function to fetch skill data
  }, [skillId]);

  // 提前return加載狀態，避免未加載完成時渲染資料
  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  // 编辑模式下的保存操作
  const handleSave = () => {
    // 假设 saveSkill 是保存技能数据的函数
    editSkill(skill).then(() => {
      setIsEditing(false); // 保存后退出编辑模式
      navigate(`/skill-detail`); // 跳转回技能详情页
    });
  };


  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          {/* 信息列表 */}
          <Box
            component="dl"
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr", // 左右兩列
              columnGap: 2,                   // 列間距
              rowGap: 1,                      // 行間距
              alignItems: "center",           // 垂直居中
            }}
          >
            {/* Skill Name */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Name:
            </Typography>
            <Typography component="dd" variant="body1">
            {isEditing ? (
                <TextField
                  value={skill.name}
                  onChange={(e) => setSkill({ ...skill, name: e.target.value })}
                  fullWidth
                  multiline
                  rows={1}
                />
              ) : (
                skill.name
              )}
            </Typography>

            {/* Skill Description */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Description:
            </Typography>
            <Typography component="dd" variant="body1">
            {isEditing ? (
                <TextField
                  value={skill.description}
                  onChange={(e) => setSkill({ ...skill, description: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                />
              ) : (
                skill.description
              )}
            </Typography>
    
            {/* Related Jobs */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Related Jobs:
            </Typography>
            <Typography component="dd" variant="body1">
              {isEditing ? (
                <TextField
                  value={skill.related_job.join(", ")}
                  onChange={(e) =>
                    setSkill({ ...skill, related_job: e.target.value.split(", ") })
                  }
                  fullWidth
                />
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}>
                  {skill.related_job.map((job, index) => (
                    <Chip key={index} label={job} color="primary" />
                  ))}
                </Box>
              )}
            </Typography>
    
            {/* Skill Status */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right" }}>
              Status:
            </Typography>
            <Typography component="dd" variant="body1">
              <Chip
                label={skill.status === 1 ? "In progress" : "Finished"}
                sx={{
                  backgroundColor: skill.status === 1 ? "#ffccbc" : "#dcedc8",
                  color: "#000",
                  marginTop: 1,
                }}
              />
            </Typography>
    
            {/* Notes */}
            <Typography component="dt" variant="body1" sx={{ textAlign: "right", alignSelf: "flex-start" }}>
              Notes:
            </Typography>
            <Typography component="dd" variant="body1">
              {isEditing ? (
                <TextField
                  value={skill.note}
                  onChange={(e) => setSkill({ ...skill, note: e.target.value })}
                  fullWidth
                  multiline
                  rows={4}
                />
              ) : (
                skill.note
              )}
            </Typography>
          </Box>
        </Grid>
      </Grid>


      {/* 保存/edit按钮 - 仅在编辑模式下显示 */}
      {isEditing && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsEditing(!isEditing)} // 点击按钮切换编辑状态
      >
        {isEditing ? "Cancel" : "Edit"}
      </Button>
    </MainCard>
  );
}

export default SkillDetail;