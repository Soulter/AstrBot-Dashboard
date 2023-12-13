from flask import Flask
import datetime
from pydantic import BaseModel

class DashBoardData(BaseModel):
    stats: dict
    configs: dict
    logs: dict
    
class Response(BaseModel):
    status: str
    message: str
    data: dict
    
class AstrBotDashBoard():
    def __init__(self, dashboard_data: DashBoardData):
        self.dashboard_data = dashboard_data
        self.dashboard_be = Flask(__name__)
        self.funcs = {}

        @self.dashboard_be.get("/stats")
        def get_stats():
            return Response(
                status="success",
                message="",
                data=self.dashboard_data.stats
            ).dict()
        
        @self.dashboard_be.get("/configs")
        def get_configs():
            return Response(
                status="success",
                message="",
                data=self.dashboard_data.configs
            ).__dict__
            
        @self.dashboard_be.post("/configs")
        def post_configs():
            if self.funcs["post_configs"](self.dashboard_data.configs):
                return Response(
                    status="success",
                    message="",
                    data=self.dashboard_data.configs
                ).__dict__
            return Response(
                status="error",
                message="",
                data=self.dashboard_data.configs
            ).__dict__
        
        @self.dashboard_be.get("/logs")
        def get_logs(self):
            return Response(
                status="success",
                message="",
                data=self.dashboard_data.logs
            ).__dict__
        
    def register(self, name: str):
        def decorator(func):
            self.funcs[name] = func
            return func
        return decorator

    def run(self):
        self.dashboard_be.run(host="0.0.0.0", port=6185)
    

dash = AstrBotDashBoard(
    DashBoardData(
        stats={
            "uptime": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "version": "0.0.1",
            "status": "online"
        },
        configs={
            "data": [
            {
                "type": "group",
                "name": "机器人平台配置",
                "description": "机器人平台配置描述",
                "body": [
                    {
                        "type": "item",
                        "val_type": "bool",
                        "name": "启用 QQ 频道平台",
                        "description": "机器人平台名称描述",
                        "value": True
                    },
                    {
                        "type": "item",
                        "val_type": "string",
                        "name": "QQ机器人APPID",
                        "description": "机器人平台名称描述",
                        "value": "123456"
                    },
                    {
                        "type": "item",
                        "val_type": "string",
                        "name": "QQ机器人令牌",
                        "description": "机器人平台名称描述",
                        "value": "123456"
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "item",
                        "val_type": "bool",
                        "name": "启用 GO-CQHTTP 平台",
                        "description": "机器人平台名称描述",
                        "value": False
                    }
                ]
            },
            {
                "type": "group",
                "name": "代理配置",
                "description": "代理配置描述",
                "body": [
                    {
                        "type": "item",
                        "val_type": "string",
                        "name": "代理地址",
                        "description": "代理配置描述",
                        "value": "http://localhost:7890"
                    }
                ]
            },
            {
                "type": "group",
                "name": "其他配置",
                "description": "其他配置描述",
                "body": [
                    {
                        "type": "item",
                        "val_type": "string",
                        "name": "回复前缀",
                        "description": "[xxxx] 你好！ 其中xxxx是你可以填写的前缀。如果为空则不显示。",
                        "value": "GPT"
                    }
                ]
            }
        ]
        },
        logs={
            "log": "log"
        }
    )
)
dash.run()